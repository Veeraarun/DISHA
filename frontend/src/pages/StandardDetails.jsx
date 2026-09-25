import { Link, useLocation, useParams } from "react-router-dom";
import StandardsGraph from "../components/StandardsGraph";
import ValidationPanel from "../components/ValidationPanel";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Network,
  ExternalLink,
  Database,
} from "lucide-react";

function StandardDetails() {
  const { standardId } = useParams();
  const location = useLocation();

  const standard = location.state?.standard;

  if (!standard) {
    return (
      <div className="min-h-full bg-[#f4f6f9]">
        <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#17365d]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="rounded-xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle size={24} />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-[#172033]">
              Standard data unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              This prototype page must be opened from an analysis
              recommendation.
            </p>

            <p className="mt-4 font-mono text-xs text-slate-400">
              {standardId}
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#17365d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102c4d]"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f4f6f9]">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to={location.state?.from || "/"}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#17365d]"
          >
            <ArrowLeft size={16} />
            Back to Analysis
          </Link>
        </div>

        {/* Page heading */}
        <section className="mb-7">
          <p className="mb-2 text-sm font-medium text-blue-700">
            Standards Intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#172033]">
            Standard Details
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Review the standard record, supporting evidence, relationships,
            and prototype validation information used by DISHA.
          </p>
        </section>

        {/* Prototype Notice */}
        <section className="mb-7 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <Database
              size={20}
              className="mt-0.5 shrink-0 text-blue-700"
            />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Prototype Knowledge Base
              </p>

              <p className="mt-1 text-sm leading-5 text-blue-800">
                This standard record is part of DISHA&apos;s prototype
                knowledge base. Production deployment will validate standard
                identity, scope, lifecycle, and related information against
                authorized standards sources.
              </p>
            </div>
          </div>
        </section>

        {/* Standard Hero */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-medium text-blue-700">
                  {standard.standard_id}
                </span>

                <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  {standard.category}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} />
                  {standard.status}
                </span>

              </div>

              <h2 className="mt-5 text-2xl font-semibold leading-8 text-[#172033] lg:text-3xl">
                {standard.title}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                {standard.description}
              </p>

            </div>

            {/* Relevance */}
            <div className="w-full shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-5 lg:w-48">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Prototype Relevance
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-700">
                {standard.relevance_score}%
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${standard.relevance_score}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Heuristic match score
              </p>

            </div>

          </div>
        </section>

        {/* Metadata */}
        <section className="mt-5 grid gap-4 md:grid-cols-3">

          <InfoCard
            label="Standard ID"
            value={standard.standard_id}
          />

          <InfoCard
            label="Category"
            value={standard.category}
          />

          <InfoCard
            label="Year"
            value={standard.year}
          />

        </section>

        {/* Recommendation */}
        <section className="mt-10">

          <SectionTitle
            icon={<ShieldCheck size={19} />}
            title="Why DISHA Recommended This"
          />

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

            <p className="text-sm leading-7 text-blue-950">
              {standard.reason ||
                "This standard contains requirements relevant to the procurement specification."}
            </p>

          </div>

        </section>

        {/* Evidence */}
        <section className="mt-10">

          <SectionTitle
            icon={<FileText size={19} />}
            title="Evidence & Clauses"
          />

          <p className="mb-4 text-sm text-slate-500">
            Supporting clause-level evidence available in the prototype
            knowledge base.
          </p>

          {standard.clauses?.length > 0 ? (
            <div className="space-y-4">

              {standard.clauses.map((clause, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-xs font-medium text-blue-700">
                      {clause.clause}
                    </span>

                    <h3 className="text-sm font-semibold text-slate-800">
                      {clause.title}
                    </h3>

                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {clause.evidence}
                  </p>

                </div>
              ))}

            </div>
          ) : (
            <EmptyState text="No evidence records available." />
          )}

        </section>

        {/* Related Standards */}
        <section className="mt-10">

          <SectionTitle
            icon={<Network size={19} />}
            title="Related Standards"
          />

          <p className="mb-4 text-sm text-slate-500">
            Standards linked to this record in the prototype knowledge base.
          </p>

          {standard.related_standards?.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex flex-wrap gap-3">

                {standard.related_standards.map((related) => (
                  <div
                    key={related}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5"
                  >
                    <Network
                      size={15}
                      className="text-slate-500"
                    />

                    <span className="font-mono text-sm text-slate-700">
                      {related}
                    </span>

                    <ExternalLink
                      size={13}
                      className="text-slate-400"
                    />
                  </div>
                ))}

              </div>

            </div>
          ) : (
            <EmptyState text="No related standards available." />
          )}

        </section>

        {/* Standards Graph */}
        <section className="mt-10">
          <SectionTitle
            icon={<Network size={19} />}
            title="Standards Relationship Graph"
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <StandardsGraph standard={standard} />
          </div>
        </section>

        {/* Validation */}
        <section className="mt-10">

          <SectionTitle
            icon={<ShieldCheck size={19} />}
            title="Validation"
          />

          <ValidationPanel standard={standard} />

        </section>

        {/* Footer */}
        <div className="mt-12 border-t border-slate-200 pt-5">

          <p className="text-xs leading-6 text-slate-400">
            DISHA prototype • Standard records displayed for demonstration
            purposes only. Production deployment will validate records against
            authorized standards sources.
          </p>

        </div>

      </main>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-slate-800">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  icon,
  title,
}) {
  return (
    <div className="mb-4 flex items-center gap-2">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h2 className="text-xl font-semibold text-[#172033]">
        {title}
      </h2>

    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
      {text}
    </div>
  );
}

export default StandardDetails;