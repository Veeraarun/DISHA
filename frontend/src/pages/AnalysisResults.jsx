import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Copy,
  Check,
  Database,
  ClipboardCheck,
  CircleAlert,
} from "lucide-react";

import { getAnalysis } from "../services/api";

function AnalysisResults() {
  const { analysisId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyAnalysisId = async () => {
    try {
      await navigator.clipboard.writeText(analysisId);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Unable to copy analysis ID:", err);
    }
  };

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const result = await getAnalysis(analysisId);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load analysis results.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f4f6f9]">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin text-blue-700" />
          Loading DISHA analysis...
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-[70vh] bg-[#f4f6f9] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-red-700">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h1 className="font-semibold text-slate-900">
                {error || "Analysis not found"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                The requested analysis could not be loaded.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#17365d] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const requirements = analysis.requirements || {};
  const recommendations = analysis.recommendations || [];
  const warnings = analysis.warnings || [];

  const primary = recommendations.filter(
    (item) => item.recommendation_type === "primary",
  );

  const supporting = recommendations.filter(
    (item) => item.recommendation_type === "supporting",
  );

  const testing = recommendations.filter(
    (item) => item.recommendation_type === "testing",
  );

  return (
    <div className="min-h-full bg-[#f4f6f9]">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Page Header */}
        <section className="mb-7">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#17365d]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-700">
                Procurement Analysis
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[#172033]">
                  Analysis Results
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Completed
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                Review extracted requirements, applicable prototype standards,
                evidence, and validation considerations.
              </p>
            </div>

            <a
              href={`http://127.0.0.1:8000/api/v1/analysis/${analysis.analysis_id}/audit-report`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17365d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102c4d]"
            >
              <Download size={17} />
              Generate Audit Report
            </a>
          </div>
        </section>

        {/* Analysis Reference */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Analysis ID
              </p>

              <p className="mt-1 break-all font-mono text-sm text-slate-700">
                {analysis.analysis_id}
              </p>
            </div>

            <button
              type="button"
              onClick={copyAnalysisId}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy ID
                </>
              )}
            </button>
          </div>
        </section>

        {/* Prototype Notice */}
        <section className="mb-7 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <Database size={20} className="mt-0.5 shrink-0 text-blue-700" />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Prototype Knowledge Base
              </p>

              <p className="mt-1 text-sm leading-5 text-blue-800">
                Recommendations shown here are generated from DISHA&apos;s
                curated prototype knowledge base. Production deployment will use
                validated standards data from authorized sources.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="grid gap-4 md:grid-cols-3">
          <OverviewCard
            icon={<CheckCircle2 size={21} />}
            iconClass="bg-emerald-50 text-emerald-700"
            label="Analysis Status"
            value={analysis.status}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
                <Search size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-600">
                    Specification Completeness
                  </p>

                  <span className="text-sm font-semibold text-blue-700">
                    {analysis.confidence}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${analysis.confidence}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Based on the procurement information detected in the
                  specification. This is not a BIS compliance or recommendation
                  confidence score.
                </p>
              </div>
            </div>
          </div>

          <OverviewCard
            icon={<FileText size={21} />}
            iconClass="bg-slate-100 text-slate-700"
            label="Standards Identified"
            value={recommendations.length}
          />
        </section>

        {/* Extracted Requirements */}
        <section className="mt-10">
          <SectionHeader
            title="Extracted Requirements"
            description="Requirements identified from the procurement specification."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RequirementCard title="Product" value={requirements.product} />

            <RequirementCard
              title="Environment"
              values={requirements.environment}
            />

            <RequirementCard title="Safety" values={requirements.safety} />

            <RequirementCard
              title="Protection"
              values={requirements.protection}
            />

            <RequirementCard title="Testing" values={requirements.testing} />

            <RequirementCard
              title="Technical Terms"
              values={requirements.technical_terms}
            />
          </div>
        </section>

        {/* Warnings */}
        {warnings.length > 0 && (
          <section className="mt-10">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <CircleAlert
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-700"
                />

                <div>
                  <h2 className="font-semibold text-amber-900">
                    Analysis Warnings
                  </h2>

                  <div className="mt-3 space-y-2">
                    {warnings.map((warning, index) => (
                      <p
                        key={index}
                        className="text-sm leading-5 text-amber-800"
                      >
                        {warning.message}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Standards */}
        <section className="mt-10">
          <SectionHeader
            title="Recommended Standards"
            description="Standards identified by DISHA based on the extracted procurement requirements."
          />

          {primary.length > 0 && (
            <RecommendationGroup
              title="Primary Standards"
              description="Standards directly associated with the core procurement requirement."
              items={primary}
              badgeClass="border-blue-200 bg-blue-50 text-blue-700"
              analysisId={analysis.analysis_id}
            />
          )}

          {supporting.length > 0 && (
            <RecommendationGroup
              title="Supporting Standards"
              description="Standards addressing additional environmental, safety, or protection requirements."
              items={supporting}
              badgeClass="border-slate-200 bg-slate-100 text-slate-700"
              analysisId={analysis.analysis_id}
            />
          )}

          {testing.length > 0 && (
            <RecommendationGroup
              title="Testing Standards"
              description="Standards associated with testing and verification requirements."
              items={testing}
              badgeClass="border-amber-200 bg-amber-50 text-amber-700"
              analysisId={analysis.analysis_id}
            />
          )}

          {recommendations.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                No applicable standards were identified.
              </p>
            </div>
          )}
        </section>

        {/* Risk & Validation */}
        <AnalysisRiskPanel analysis={analysis} />

        {/* Footer */}
        <div className="mt-12 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-400">Analysis ID</p>

          <p className="mt-1 break-all font-mono text-xs text-slate-500">
            {analysis.analysis_id}
          </p>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({ icon, iconClass, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${iconClass}`}>{icon}</div>

        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-1 text-xl font-semibold capitalize text-[#172033]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[#172033]">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

/* ============================================================
   REQUIREMENT CARD
============================================================ */

function RequirementCard({ title, value, values }) {
  const items = values || (value ? [value] : []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{title}</p>

        <ClipboardCheck size={17} className="text-slate-400" />
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">Not detected</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   RECOMMENDATION GROUP
============================================================ */

function RecommendationGroup({
  title,
  description,
  items,
  badgeClass,
  analysisId,
}) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#172033]">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="space-y-4">
        {items.map((standard) => (
          <StandardCard
            key={standard.standard_id}
            standard={standard}
            badgeClass={badgeClass}
            analysisId={analysisId}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STANDARD CARD
============================================================ */

function StandardCard({ standard, badgeClass, analysisId }) {
  const [expanded, setExpanded] = useState(false);

  const matchStrength = standard.match_evidence?.match_strength || "LOW";

  const matchStrengthClass =
    matchStrength === "HIGH"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : matchStrength === "MEDIUM"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeClass}`}
            >
              {standard.recommendation_type}
            </span>

            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
              {standard.standard_id}
            </span>

            <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
              {standard.category}
            </span>

            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {standard.status}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold leading-6 text-[#172033]">
            {standard.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {standard.description}
          </p>
        </div>

        {/* Relevance */}
        <div className="w-full shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:w-40">
          <p className="text-xs font-medium text-slate-500">
            Prototype Relevance
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">
            {standard.relevance_score}%
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${standard.relevance_score}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Why Recommended */}
      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          Why this standard was identified
        </p>

        <p className="mt-2 text-sm leading-6 text-blue-900">
          {standard.reason}
        </p>
      </div>

      {/* Match Evidence */}
      {standard.match_evidence && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Evidence from Prototype Knowledge Base
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Transparent matching evidence from the current prototype
                knowledge base.
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${matchStrengthClass}`}
            >
              {matchStrength}
            </span>
          </div>

          {/* Matched Terms */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Matched Terms
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {standard.match_evidence.matched_terms.map((term) => (
                <span
                  key={term}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                >
                  ✓ {term}
                </span>
              ))}
            </div>
          </div>

          {/* Other Terms */}
          {standard.match_evidence.unmatched_terms?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Additional Terms in Knowledge Base Record
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {standard.match_evidence.unmatched_terms.map((term) => (
                  <span
                    key={term}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weighted Evidence */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm text-slate-500">Weighted Evidence</span>

            <span className="font-mono text-sm font-semibold text-slate-700">
              {standard.match_evidence.weighted_match}
              {" / "}
              {standard.match_evidence.total_weight}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Prototype heuristic only. This evidence is not an official BIS
            compliance determination.
          </p>
        </div>
      )}

      {/* Expand */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-5 flex w-full items-center justify-between border-t border-slate-200 pt-4 text-sm font-medium text-slate-600 transition hover:text-[#17365d]"
      >
        <span>
          {expanded
            ? "Hide evidence and relationships"
            : "View evidence and relationships"}
        </span>

        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="mt-5 space-y-6">
          {/* Evidence / Clauses */}
          {standard.clauses?.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText size={17} className="text-slate-500" />

                <h4 className="font-semibold text-slate-800">
                  Evidence & Clauses
                </h4>
              </div>

              <div className="space-y-3">
                {standard.clauses.map((clause, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-blue-700">
                        {clause.clause}
                      </span>

                      <span className="text-sm font-medium text-slate-800">
                        {clause.title}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {clause.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Standards */}
          {standard.related_standards?.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ExternalLink size={17} className="text-slate-500" />

                <h4 className="font-semibold text-slate-800">
                  Related Standards
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {standard.related_standards.map((related) => (
                  <span
                    key={related}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-600"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standard Details */}
      <Link
        to={`/standard/${standard.standard_id}`}
        state={{
          standard,
          from: `/analysis/${analysisId}`,
        }}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#17365d] transition hover:bg-slate-50"
      >
        View Standard Details
        <ExternalLink size={15} />
      </Link>
    </article>
  );
}

/* ============================================================
   RISK & VALIDATION
============================================================ */

function AnalysisRiskPanel({ analysis }) {
  const completeness = analysis.confidence ?? 0;
  const standardsCount = analysis.recommendations?.length ?? 0;

  const sourceRisk = "MEDIUM";
  const certificationRisk = "MEDIUM";
  const lifecycleRisk = standardsCount > 0 ? "LOW" : "MEDIUM";

  const overallRisk =
    sourceRisk === "MEDIUM" || certificationRisk === "MEDIUM"
      ? "MEDIUM"
      : "LOW";

  const riskClass = (risk) => {
    if (risk === "LOW") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (risk === "HIGH") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#172033]">
          Risk & Validation
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Prototype validation checks associated with this procurement analysis.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Overall */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Overall Prototype Risk
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Based on prototype validation rules and available evidence.
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${riskClass(
              overallRisk,
            )}`}
          >
            {overallRisk}
          </span>
        </div>

        {/* Checks */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">
            Validation Checks
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <RiskCheck
              title="Specification Completeness"
              value={completeness >= 75 ? "LOW RISK" : "MEDIUM RISK"}
              description={`${completeness}% of prototype requirement categories detected.`}
              className={riskClass(completeness >= 75 ? "LOW" : "MEDIUM")}
            />

            <RiskCheck
              title="Standard Lifecycle"
              value={`${lifecycleRisk} RISK`}
              description={
                standardsCount > 0
                  ? "Recommended prototype records have an ACTIVE status."
                  : "No standards were identified for lifecycle validation."
              }
              className={riskClass(lifecycleRisk)}
            />

            <RiskCheck
              title="Source Verification"
              value={`${sourceRisk} RISK`}
              description="Production source validation is not connected in the prototype."
              className={riskClass(sourceRisk)}
            />

            <RiskCheck
              title="Certification Verification"
              value={`${certificationRisk} RISK`}
              description="Certification verification is not available in the prototype."
              className={riskClass(certificationRisk)}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs leading-relaxed text-slate-500">
            These risk indicators are prototype rule-based assessments. They are
            not official BIS compliance determinations, certification decisions,
            or legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   RISK CHECK
============================================================ */

function RiskCheck({ title, value, description, className }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export default AnalysisResults;
