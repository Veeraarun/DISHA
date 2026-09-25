from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


def generate_audit_report(analysis: dict) -> BytesIO:
    """
    Generate a PDF audit report from a completed DISHA analysis.
    """

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="DISHA Procurement Standards Audit Report",
        author="DISHA",
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DishaTitle",
        parent=styles["Title"],
        fontSize=22,
        leading=27,
        alignment=TA_CENTER,
        spaceAfter=8,
        textColor=colors.HexColor("#0f172a"),
    )

    subtitle_style = ParagraphStyle(
        "DishaSubtitle",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=18,
    )

    heading_style = ParagraphStyle(
        "DishaHeading",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor("#1e3a8a"),
    )

    body_style = ParagraphStyle(
        "DishaBody",
        parent=styles["BodyText"],
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#334155"),
    )

    small_style = ParagraphStyle(
        "DishaSmall",
        parent=styles["BodyText"],
        fontSize=7.5,
        leading=11,
        textColor=colors.HexColor("#64748b"),
    )

    story = []

    # ---------------------------------------------------------
    # Header
    # ---------------------------------------------------------

    story.append(Paragraph("DISHA", title_style))

    story.append(
        Paragraph(
            "Digital Indian Standards Heuristic Assistant",
            subtitle_style,
        )
    )

    story.append(
        Paragraph(
            "Procurement Standards Analysis & Audit Report",
            heading_style,
        )
    )

    generated_at = datetime.now().strftime(
        "%d %B %Y, %I:%M %p"
    )

    metadata = [
        ["Analysis ID", analysis.get("analysis_id", "N/A")],
        ["Status", analysis.get("status", "N/A")],
        ["Confidence", f"{analysis.get('confidence', 0)}%"],
        ["Generated", generated_at],
        ["Knowledge Base", "Prototype Knowledge Base"],
    ]

    metadata_table = Table(
        metadata,
        colWidths=[42 * mm, 125 * mm],
    )

    metadata_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.HexColor("#f1f5f9"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (0, -1),
                    colors.HexColor("#475569"),
                ),
                (
                    "TEXTCOLOR",
                    (1, 0),
                    (1, -1),
                    colors.HexColor("#0f172a"),
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, -1),
                    "Helvetica",
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(metadata_table)
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # Procurement Specification
    # ---------------------------------------------------------

    story.append(
        Paragraph(
            "1. Procurement Specification",
            heading_style,
        )
    )

    input_text = analysis.get(
        "input_text",
        "No procurement specification available.",
    )

    story.append(
        Table(
            [[Paragraph(input_text, body_style)]],
            colWidths=[167 * mm],
            style=TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#f8fafc"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#cbd5e1"),
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                ]
            ),
        )
    )

    # ---------------------------------------------------------
    # Extracted Requirements
    # ---------------------------------------------------------

    story.append(
        Paragraph(
            "2. Extracted Requirements",
            heading_style,
        )
    )

    requirements = analysis.get("requirements", {})

    requirement_rows = [
        ["Requirement", "Extracted Value"],
    ]

    for key, value in requirements.items():
        if isinstance(value, list):
            display_value = (
                ", ".join(str(item) for item in value)
                if value
                else "None identified"
            )
        else:
            display_value = (
                str(value)
                if value
                else "Not identified"
            )

        requirement_rows.append(
            [
                key.replace("_", " ").title(),
                display_value,
            ]
        )

    requirements_table = Table(
        requirement_rows,
        colWidths=[55 * mm, 112 * mm],
        repeatRows=1,
    )

    requirements_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1e3a8a"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (-1, -1),
                    colors.white,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1"),
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(requirements_table)

    # ---------------------------------------------------------
    # Recommendations
    # ---------------------------------------------------------

    story.append(
        Paragraph(
            "3. Recommended Standards",
            heading_style,
        )
    )

    recommendations = analysis.get(
        "recommendations",
        [],
    )

    if recommendations:

        recommendation_rows = [
            [
                "Standard",
                "Category",
                "Status",
                "Relevance",
            ]
        ]

        for standard in recommendations:
            recommendation_rows.append(
                [
                    Paragraph(
                        f"{standard.get('standard_id', 'N/A')}<br/>"
                        f"{standard.get('title', 'N/A')}",
                        small_style,
                    ),
                    standard.get("category", "N/A"),
                    standard.get("status", "N/A"),
                    f"{standard.get('relevance_score', 0)}%",
                ]
            )

        recommendation_table = Table(
            recommendation_rows,
            colWidths=[
                70 * mm,
                35 * mm,
                25 * mm,
                25 * mm,
            ],
            repeatRows=1,
        )

        recommendation_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.HexColor("#1e3a8a"),
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, 0),
                        colors.white,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        "Helvetica-Bold",
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#cbd5e1"),
                    ),
                    (
                        "FONTSIZE",
                        (0, 0),
                        (-1, -1),
                        7.5,
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(recommendation_table)

    else:
        story.append(
            Paragraph(
                "No standards were identified.",
                body_style,
            )
        )

    # ---------------------------------------------------------
    # Detailed Evidence
    # ---------------------------------------------------------

    story.append(PageBreak())

    story.append(
        Paragraph(
            "4. Evidence & Clauses",
            heading_style,
        )
    )

    for standard in recommendations:

        story.append(
            Paragraph(
                f"<b>{standard.get('standard_id', 'N/A')}</b> — "
                f"{standard.get('title', 'N/A')}",
                body_style,
            )
        )

        clauses = standard.get("clauses", [])

        if clauses:

            clause_rows = [
                ["Clause", "Title", "Evidence"],
            ]

            for clause in clauses:
                clause_rows.append(
                    [
                        clause.get("clause", "N/A"),
                        clause.get("title", "N/A"),
                        Paragraph(
                            clause.get(
                                "evidence",
                                "No evidence available.",
                            ),
                            small_style,
                        ),
                    ]
                )

            clause_table = Table(
                clause_rows,
                colWidths=[
                    25 * mm,
                    42 * mm,
                    100 * mm,
                ],
                repeatRows=1,
            )

            clause_table.setStyle(
                TableStyle(
                    [
                        (
                            "BACKGROUND",
                            (0, 0),
                            (-1, 0),
                            colors.HexColor("#e2e8f0"),
                        ),
                        (
                            "FONTNAME",
                            (0, 0),
                            (-1, 0),
                            "Helvetica-Bold",
                        ),
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.5,
                            colors.HexColor("#cbd5e1"),
                        ),
                        (
                            "FONTSIZE",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                        (
                            "VALIGN",
                            (0, 0),
                            (-1, -1),
                            "TOP",
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            5,
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            5,
                        ),
                    ]
                )
            )

            story.append(Spacer(1, 5))
            story.append(clause_table)
            story.append(Spacer(1, 12))

    # ---------------------------------------------------------
    # Related Standards
    # ---------------------------------------------------------

    story.append(
        Paragraph(
            "5. Standards Relationships",
            heading_style,
        )
    )

    for standard in recommendations:

        related = standard.get(
            "related_standards",
            [],
        )

        if related:

            story.append(
                Paragraph(
                    f"<b>{standard.get('standard_id', 'N/A')}</b> "
                    f"is related to: "
                    f"{', '.join(related)}",
                    body_style,
                )
            )

            story.append(Spacer(1, 5))

    # ---------------------------------------------------------
    # Validation
    # ---------------------------------------------------------

    story.append(
        Paragraph(
            "6. Validation & Procurement Risk",
            heading_style,
        )
    )

    validation_rows = [
        ["Validation Area", "Assessment"],
        [
            "Standard identity",
            "Prototype record",
        ],
        [
            "Lifecycle status",
            "Validated against prototype record",
        ],
        [
            "Source validation",
            "Pending production integration",
        ],
        [
            "Certification verification",
            "Not available in prototype",
        ],
        [
            "Risk assessment",
            "Prototype rule-based assessment",
        ],
    ]

    validation_table = Table(
        validation_rows,
        colWidths=[65 * mm, 102 * mm],
        repeatRows=1,
    )

    validation_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1e3a8a"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1"),
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(validation_table)

    # ---------------------------------------------------------
    # Disclaimer
    # ---------------------------------------------------------

    story.append(Spacer(1, 16))

    disclaimer = (
        "<b>Prototype Disclaimer:</b> "
        "This report was generated using DISHA's Prototype "
        "Knowledge Base. The standards records, evidence and "
        "risk indicators shown in this prototype are for "
        "demonstration purposes. Production deployment will "
        "validate standard identity, scope, lifecycle and "
        "certification information against authorized sources. "
        "This report is not an official BIS compliance "
        "determination."
    )

    story.append(
        Table(
            [[Paragraph(disclaimer, small_style)]],
            colWidths=[167 * mm],
            style=TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#fff7ed"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#fed7aa"),
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                ]
            ),
        )
    )

    document.build(story)

    buffer.seek(0)

    return buffer