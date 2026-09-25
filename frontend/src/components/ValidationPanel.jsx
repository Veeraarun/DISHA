import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  CircleAlert,
} from "lucide-react";

function ValidationPanel({ standard }) {
  const isActive = standard?.status === "ACTIVE";

  const validationItems = [
    {
      label: "Standard identity",
      status: "Prototype record",
      type: "success",
    },
    {
      label: "Lifecycle status",
      status: standard?.status || "Unknown",
      type: isActive ? "success" : "warning",
    },
    {
      label: "Source validation",
      status: "Pending production integration",
      type: "warning",
    },
    {
      label: "Certification verification",
      status: "Not available in prototype",
      type: "warning",
    },
  ];

  const warningCount = validationItems.filter(
    (item) => item.type === "warning"
  ).length;

  const riskLevel =
    warningCount >= 2
      ? "MEDIUM"
      : warningCount === 1
        ? "LOW"
        : "LOW";

  const riskWidth =
    riskLevel === "HIGH"
      ? "85%"
      : riskLevel === "MEDIUM"
        ? "60%"
        : "30%";

  return (
    <section>
      {/* Section heading */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <ShieldCheck size={18} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#172033]">
            Validation & Procurement Risk
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Prototype validation checks for this standard recommendation.
          </p>
        </div>
      </div>

      {/* Validation + Risk */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* Validation Checks */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Validation Checks
            </h3>
          </div>

          <div>
            {validationItems.map((item) => (
              <ValidationItem
                key={item.label}
                label={item.label}
                status={item.status}
                type={item.type}
              />
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle size={18} />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Prototype Risk
            </h3>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overall assessment
            </p>

            <p className="mt-1 text-3xl font-bold text-amber-700">
              {riskLevel}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{
                width: riskWidth,
              }}
            />
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            Additional verification is required before this prototype
            recommendation can be treated as a production procurement
            decision.
          </p>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Risk Breakdown
          </h3>
        </div>

        <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">

          <RiskRow
            label="Specification completeness"
            status="LOW RISK"
            description="Required procurement information is available in the analyzed specification."
            type="success"
          />

          <RiskRow
            label="Standard lifecycle"
            status={isActive ? "LOW RISK" : "REVIEW"}
            description={
              isActive
                ? "The prototype record is marked ACTIVE."
                : "The prototype record requires lifecycle review."
            }
            type={isActive ? "success" : "warning"}
          />

          <RiskRow
            label="Source verification"
            status="MEDIUM RISK"
            description="Production deployment must validate the standard against an authorized source."
            type="warning"
          />

          <RiskRow
            label="Certification verification"
            status="MEDIUM RISK"
            description="Certification requirements are not connected to a production verification source."
            type="warning"
          />

        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <CircleAlert
          size={18}
          className="mt-0.5 shrink-0 text-slate-400"
        />

        <p className="text-xs leading-6 text-slate-500">
          These risk indicators are prototype rule-based assessments. They
          are not official BIS compliance determinations or certification
          decisions.
        </p>
      </div>
    </section>
  );
}

function ValidationItem({ label, status, type }) {
  const isSuccess = type === "success";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <CheckCircle2
            size={18}
            className="text-emerald-600"
          />
        ) : (
          <AlertTriangle
            size={18}
            className="text-amber-600"
          />
        )}

        <span className="text-sm text-slate-700">
          {label}
        </span>
      </div>

      <span
        className={`rounded-md px-3 py-1.5 text-xs font-medium ${
          isSuccess
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function RiskRow({
  label,
  status,
  description,
  type,
}) {
  const isSuccess = type === "success";

  return (
    <div className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>

        <span
          className={`w-fit shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold ${
            isSuccess
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default ValidationPanel;