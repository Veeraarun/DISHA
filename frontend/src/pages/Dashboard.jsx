import { Link } from "react-router-dom";
import {
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2,
  ClipboardList,
  Network,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="min-h-full bg-[#f4f6f9]">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Page Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-700">
                Procurement Intelligence
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#172033]">
                Standards Analysis Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Analyze procurement specifications and identify potentially
                applicable Indian Standards, supporting evidence, and
                validation considerations.
              </p>
            </div>

            <Link
              to="/analysis/new"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17365d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102c4d]"
            >
              <FileSearch size={18} />
              Start New Analysis
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Prototype Notice */}
        <section className="mb-8 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4">
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
                Results currently use a curated prototype standards knowledge
                base. Production deployment will populate and validate records
                from authorized BIS sources.
              </p>
            </div>
          </div>
        </section>

        {/* System Overview */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#172033]">
              System Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current DISHA analysis capabilities
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <CapabilityCard
              icon={<FileSearch size={21} />}
              title="Specification Analysis"
              status="Ready"
              description="Extract procurement requirements and technical terms from submitted specifications."
            />

            <CapabilityCard
              icon={<ShieldCheck size={21} />}
              title="Standards Validation"
              status="Active"
              description="Identify relevant standards and present their status, relationships, and supporting evidence."
            />

            <CapabilityCard
              icon={<AlertTriangle size={21} />}
              title="Risk Detection"
              status="Ready"
              description="Highlight incomplete specifications, verification gaps, and prototype validation risks."
            />

          </div>
        </section>

        {/* Workflow */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-[#172033]">
              DISHA Analysis Workflow
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              How a procurement specification moves through the prototype system
            </p>
          </div>

          <div className="grid divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">

            <WorkflowStep
              number="01"
              icon={<ClipboardList size={20} />}
              title="Requirements"
              description="Extract product, environment, safety, protection and testing requirements."
            />

            <WorkflowStep
              number="02"
              icon={<Network size={20} />}
              title="Matching"
              description="Compare detected requirements against the standards knowledge base."
            />

            <WorkflowStep
              number="03"
              icon={<FileSearch size={20} />}
              title="Evidence"
              description="Show matched terms, relevance and supporting clause-level evidence."
            />

            <WorkflowStep
              number="04"
              icon={<CheckCircle2 size={20} />}
              title="Validation"
              description="Present lifecycle, source, certification and prototype risk checks."
            />

          </div>
        </section>

        {/* Quick Start */}
        <section className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[#172033]">
                Ready to analyze a specification?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Start with a procurement description or use the browser
                extension to analyze selected text from a procurement portal.
              </p>
            </div>

            <Link
              to="/analysis/new"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#17365d] transition hover:bg-slate-50"
            >
              Open Analysis
              <ArrowRight size={16} />
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  status,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">

      <div className="mb-5 flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          {icon}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {status}
        </span>

      </div>

      <h3 className="text-base font-semibold text-[#172033]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function WorkflowStep({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="p-6">

      <div className="mb-4 flex items-center justify-between">

        <span className="text-xs font-semibold tracking-wider text-slate-400">
          {number}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </div>

      </div>

      <h3 className="text-sm font-semibold text-[#172033]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default Dashboard;