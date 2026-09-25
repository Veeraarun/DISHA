import {
  Network,
  ArrowRight,
  ShieldCheck,
  TestTube2,
} from "lucide-react";

function StandardsGraph({ standard }) {
  const relatedStandards = standard?.related_standards || [];

  if (!relatedStandards.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Network size={18} />
          </div>

          <h2 className="text-xl font-semibold text-[#172033]">
            Standards Relationship Graph
          </h2>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          No related standards are available for this prototype record.
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Section heading */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Network size={18} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#172033]">
            Standards Relationship Graph
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Visual representation of standards related to this recommendation.
          </p>
        </div>
      </div>

      {/* Graph container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex min-h-[320px] flex-col items-center justify-center">

          {/* Main Standard */}
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Current Standard
                </p>

                <h3 className="mt-1 text-sm font-semibold leading-5 text-[#172033]">
                  {standard.title}
                </h3>

                <p className="mt-2 font-mono text-xs text-slate-400">
                  {standard.standard_id}
                </p>
              </div>

            </div>
          </div>

          {/* Connection */}
          <div className="relative flex h-14 items-center">
            <div className="h-14 w-px border-l border-dashed border-slate-300" />

            <div className="absolute left-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
              related to
            </div>
          </div>

          {/* Related Standards */}
          <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
            {relatedStandards.map((relatedId) => {
              const isTesting =
                relatedId.toLowerCase().includes("test");

              return (
                <div
                  key={relatedId}
                  className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  {/* Connector */}
                  <div className="absolute left-1/2 -top-6 h-6 -translate-x-1/2 border-l border-dashed border-slate-300" />

                  <div className="flex items-start gap-4">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        isTesting
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isTesting ? (
                        <TestTube2 size={22} />
                      ) : (
                        <Network size={22} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Related Standard
                      </p>

                      <h3 className="mt-1 text-sm font-semibold text-slate-800">
                        {getDisplayName(relatedId)}
                      </h3>

                      <p className="mt-2 font-mono text-xs text-slate-400">
                        {relatedId}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="mt-1 shrink-0 text-slate-400"
                    />

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-200 pt-5 text-xs text-slate-500">

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Current standard
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            Related standard
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Testing relationship
          </div>

        </div>
      </div>
    </section>
  );
}

function getDisplayName(standardId) {
  const names = {
    "DEMO-LED-TEST-001": "LED Lighting Testing",
    "DEMO-ELECTRICAL-001": "Electrical Safety",
    "DEMO-IP-001": "Ingress Protection",
    "DEMO-LED-001": "Outdoor LED Lighting",
  };

  return names[standardId] || "Related Standard";
}

export default StandardsGraph;