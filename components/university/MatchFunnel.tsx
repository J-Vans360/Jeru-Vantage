'use client';

interface FunnelProps {
  impressions: number;
  clicks: number;
  leads: number;
  enrolled: number;
}

export default function MatchFunnel({
  impressions,
  clicks,
  leads,
  enrolled,
}: FunnelProps) {
  const stages = [
    { label: 'Impressions', value: impressions, color: 'bg-blue-500' },
    { label: 'Clicks', value: clicks, color: 'bg-purple-500' },
    { label: 'Leads', value: leads, color: 'bg-green-500' },
    { label: 'Enrolled', value: enrolled, color: 'bg-orange-500' },
  ];

  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const widthPercent = (stage.value / maxValue) * 100;
        const dropOff =
          index > 0
            ? (
                ((stages[index - 1].value - stage.value) /
                  stages[index - 1].value) *
                100
              ).toFixed(0)
            : null;

        return (
          <div key={stage.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{stage.label}</span>
              <span className="text-gray-900 font-semibold">
                {stage.value.toLocaleString()}
              </span>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
              <div
                className={`h-full ${stage.color} rounded-lg transition-all duration-500`}
                style={{ width: `${widthPercent}%` }}
              />
              {dropOff && Number(dropOff) > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  -{dropOff}%
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
