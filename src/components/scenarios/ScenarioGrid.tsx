import type { Scenario } from '@/core/types';
import ScenarioCard from './ScenarioCard';

export default function ScenarioGrid({ scenarios, onSelect }: { scenarios: Scenario[]; onSelect: (scenario: Scenario) => void }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{scenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} onClick={() => onSelect(scenario)} />)}</div>;
}
