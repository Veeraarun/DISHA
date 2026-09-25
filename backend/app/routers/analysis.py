from uuid import uuid4
from io import BytesIO

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from pypdf import PdfReader

from app.services.audit_report import generate_audit_report
from app.services.recommendation_engine import recommend_standards
from app.services.requirement_extractor import (
    extract_requirements,
    calculate_confidence,
)

router = APIRouter(
    prefix="/api/v1",
    tags=["Analysis"],
)


# Temporary in-memory storage.
# PostgreSQL will replace this in a later phase.
analysis_store = {}


class AnalysisRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        description="Procurement specification text",
    )


def run_analysis(text: str) -> dict:
    """
    Run the common DISHA analysis pipeline.
    Used by both text and PDF analysis.
    """

    analysis_id = str(uuid4())

    # Step 1: Extract structured requirements
    requirements = extract_requirements(text)

    # Step 2: Calculate specification completeness
    confidence = calculate_confidence(requirements)

    # Step 3: Find applicable standards
    recommendations = recommend_standards(text)

    # Step 4: Generate warnings
    warnings = []

    if confidence < 50:
        warnings.append(
            {
                "type": "INSUFFICIENT_INFORMATION",
                "message": (
                    "Insufficient information to confidently identify "
                    "applicable standards. Please provide additional "
                    "product, technical, safety, environmental, "
                    "or testing requirements."
                ),
            }
        )

    # Step 5: Build analysis result
    analysis = {
        "analysis_id": analysis_id,
        "status": "completed",
        "requirements": requirements,
        "confidence": confidence,
        "recommendations": recommendations,
        "warnings": warnings,
        "input_text": text,
    }

    # Step 6: Store temporarily
    analysis_store[analysis_id] = analysis

    return analysis


@router.post("/analyze")
def analyze(request: AnalysisRequest):
    """
    Analyze a procurement specification supplied as text.
    """

    return run_analysis(request.text)


@router.post("/analyze/pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    """
    Extract text from a PDF procurement specification
    and run the standard DISHA analysis pipeline.
    """

    # Validate file type
    filename = file.filename or ""

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    # Read uploaded file
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty.",
        )

    try:
        reader = PdfReader(BytesIO(file_bytes))

        extracted_pages = []

        for page in reader.pages:
            page_text = page.extract_text() or ""

            if page_text.strip():
                extracted_pages.append(page_text.strip())

        extracted_text = "\n\n".join(extracted_pages).strip()

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to read the PDF: {str(exc)}",
        ) from exc

    if len(extracted_text) < 10:
        raise HTTPException(
            status_code=400,
            detail=(
                "The PDF does not contain enough extractable text. "
                "Scanned or image-only PDFs will require OCR."
            ),
        )

    return run_analysis(extracted_text)


@router.get("/analysis/{analysis_id}")
def get_analysis(analysis_id: str):
    """
    Retrieve a previously created analysis by ID.
    """

    analysis = analysis_store.get(analysis_id)

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found",
        )

    return analysis


@router.get("/analysis/{analysis_id}/audit-report")
def download_audit_report(analysis_id: str):
    analysis = analysis_store.get(analysis_id)

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found",
        )

    pdf_buffer = generate_audit_report(analysis)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="DISHA-Audit-{analysis_id}.pdf"'
            )
        },
    )