import type { Scenario, ScenarioCategory } from '@/core/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const labels: Record<ScenarioCategory, string> = {
  weekly: 'أسبوعي',
  operational: 'تشغيلي',
  approval: 'اعتمادي',
  coordination: 'تنسيقي'
};

export default function ScenarioCard({ scenario, onClick }: { scenario: Scenario; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-elevated" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-2xl">{scenario.icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-slate-900">{scenario.title}</h3>
            <Badge>{labels[scenario.category]}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{scenario.description}</p>
          {scenario.tags && <div className="mt-3 flex flex-wrap gap-2">{scenario.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>}
        </div>
      </div>
    </Card>
  );
}
