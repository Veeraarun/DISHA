# DISHA — Indian Standards Recommendation Engine 🇮🇳

**DISHA** is a prototype AI-powered recommendation system for helping procurement users identify applicable **Indian Standards (IS)** from product or procurement specifications.

The project is designed around a practical procurement workflow: understand a specification, extract its requirements, match those requirements against a knowledge base of standards, and present explainable recommendations.

## 🎯 Problem

Procurement specifications can contain technical requirements spread across long descriptions or documents. Identifying the relevant Indian Standards manually can be time-consuming and may require domain expertise.

DISHA explores a faster workflow where a user can submit procurement specifications and receive relevant standard recommendations with supporting requirement matches.

## ✨ Key Features

- Procurement specification analysis.
- Requirement extraction from submitted text.
- Recommendation of applicable Indian Standards.
- Prototype standards knowledge base.
- Relevance/confidence information for recommendations.
- Analysis results dashboard.
- Standards graph and validation-oriented UI.
- Support for text/PDF-oriented procurement workflows in the prototype.
- Browser-extension workflow for capturing selected web content.
- React frontend and FastAPI backend.
- PostgreSQL database support.
- REST API architecture.

## 🏗️ Architecture

```text
Procurement User
      │
      ├── Web App
      ├── Browser Extension
      └── Document/Text Input
              │
              ▼
       React + Vite Frontend
              │
              │ REST API
              ▼
          FastAPI Backend
              │
        ┌─────┴─────┐
        ▼           ▼
   PostgreSQL    Standards KB
        │           │
        └─────┬─────┘
              ▼
      Requirement Analysis
              │
              ▼
   Standard Recommendations
              │
              ▼
      Results / Validation UI
```

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Routing | React Router |
| HTTP | Axios |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Documents | Python multipart, Pillow, ReportLab |
| Browser Integration | Browser extension |
| Version Control | Git + GitHub |

## 📁 Project Structure

```text
DISHA/
├── frontend/       # React + Vite procurement interface
├── backend/        # FastAPI API and analysis services
├── extension/      # Browser extension for specification capture
└── README.md
```

## 🔄 Analysis Workflow

1. The user submits a procurement specification.
2. DISHA extracts technical requirements from the input.
3. Requirements are compared against the prototype Indian Standards knowledge base.
4. Candidate standards are scored/recommended.
5. The frontend displays the analysis status, extracted requirements, confidence/relevance information, and recommendations.
6. Validation and standards-relationship views help the user inspect the result.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Python 3.11+
- PostgreSQL

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the API with the project's FastAPI entry point, for example:

```bash
uvicorn app.main:app --reload
```

> The exact database/environment values should be configured according to the backend configuration files in the repository.

## 🌐 Browser Extension

The `extension/` directory contains the browser-integration prototype used to capture procurement text from webpages and pass it into the analysis workflow.

## 📌 Project Status

Prototype / hackathon project. The knowledge base and recommendation workflow are designed for demonstration and experimentation and should not be treated as an authoritative substitute for official Indian Standards documentation.

## 👥 Team Context

DISHA was developed as a collaborative academic/hackathon project.

## 👤 Repository

**Veeraarun V** — [GitHub](https://github.com/Veeraarun)
