import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileSearch,
  Loader2,
  Info,
  ClipboardPaste,
  Upload,
  FileText,
  X,
} from "lucide-react";

import {
  analyzeSpecification,
  analyzePdf,
} from "../services/api";

function NewAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [inputMode, setInputMode] = useState("text");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const selectedText = searchParams.get("text");

    if (selectedText) {
      setText(selectedText);
      setInputMode("text");
    }
  }, [searchParams]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setInputMode("pdf");
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);

    try {
      let result;

      if (inputMode === "pdf") {
        if (!file) {
          setError("Please select a PDF file.");
          setLoading(false);
          return;
        }

        result = await analyzePdf(file);
      } else {
        if (!text.trim()) {
          setError("Please enter a procurement specification.");
          setLoading(false);
          return;
        }

        result = await analyzeSpecification(text.trim());
      }

      navigate(`/analysis/${result.analysis_id}`);
    } catch (err) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.detail;

      setError(
        backendMessage ||
          "Unable to analyze the specification. Make sure the DISHA backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const isExtensionText =
    Boolean(searchParams.get("text"));

  return (
    <div className="min-h-full bg-[#f4f6f9]">
      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#17365d]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              New Analysis
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#172033]">
              Analyze Procurement Specification
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Provide the technical specification or procurement
              document you want DISHA to analyze for potentially
              applicable standards.
            </p>
          </div>
        </div>

        {/* Main Analysis Form */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <FileSearch size={22} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#172033]">
                  Procurement Specification
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the requirements manually or upload a
                  procurement specification PDF.
                </p>
              </div>

            </div>
          </div>

          <div className="p-6">

            {/* Input Mode */}
            <div className="mb-6 flex rounded-lg border border-slate-200 bg-slate-50 p-1">

              <button
                type="button"
                onClick={() => {
                  setInputMode("text");
                  setError("");
                }}
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  inputMode === "text"
                    ? "bg-white text-[#17365d] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ClipboardPaste size={16} />
                Enter Specification
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode("pdf");
                  setError("");
                }}
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                  inputMode === "pdf"
                    ? "bg-white text-[#17365d] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Upload size={16} />
                Upload PDF
              </button>

            </div>

            {/* TEXT INPUT */}
            {inputMode === "text" && (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="procurement-specification"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Specification
                  </label>

                  <span className="text-xs text-slate-400">
                    {text.trim().length} characters
                  </span>
                </div>

                <textarea
                  id="procurement-specification"
                  value={text}
                  onChange={(event) =>
                    setText(event.target.value)
                  }
                  disabled={loading}
                  className="min-h-[280px] w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:opacity-70"
                  placeholder="Example: Procure outdoor LED street lighting systems with electrical safety, IP65 ingress protection and performance testing requirements."
                />

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start gap-3">

                    <Info
                      size={18}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        For better analysis
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Include the product or service, intended
                        environment, safety requirements, protection
                        requirements, testing requirements, and
                        important technical specifications when
                        available.
                      </p>
                    </div>

                  </div>
                </div>
              </>
            )}

            {/* PDF INPUT */}
            {inputMode === "pdf" && (
              <div>

                <label
                  htmlFor="pdf-upload"
                  className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
                >

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Upload size={25} />
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Upload procurement specification
                  </p>

                  <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                    Select a PDF containing the technical
                    specification, tender requirement, or procurement
                    document you want DISHA to analyze.
                  </p>

                  <span className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-[#17365d]">
                    Choose PDF
                  </span>

                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />

                </label>

                {file && (
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {file.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={loading}
                      className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Remove PDF"
                    >
                      <X size={16} />
                    </button>

                  </div>
                )}

                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-sm font-medium text-amber-900">
                    PDF text extraction
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    The current prototype extracts selectable text from
                    PDFs. Scanned or image-only documents will require
                    OCR in a later phase.
                  </p>
                </div>

              </div>
            )}

            {/* Extension Context */}
            {isExtensionText && inputMode === "text" && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">

                <ClipboardPaste
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-700"
                />

                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Text imported from procurement page
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-800">
                    The selected text was passed to DISHA through the
                    browser extension. Review it before starting the
                    analysis.
                  </p>
                </div>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-800">
                  Analysis could not be started
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs leading-5 text-slate-400">
                DISHA will analyze the submitted specification against
                the current prototype knowledge base.
              </p>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={
                  loading ||
                  (inputMode === "text"
                    ? !text.trim()
                    : !file)
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#17365d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102c4d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with DISHA
                    <ArrowLeft
                      size={17}
                      className="rotate-180"
                    />
                  </>
                )}
              </button>

            </div>

          </div>
        </section>

        {/* Prototype Disclaimer */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-400">
            Prototype system • Recommendations are not a substitute
            for official standards verification.
          </p>
        </div>

      </main>
    </div>
  );
}

export default NewAnalysis;