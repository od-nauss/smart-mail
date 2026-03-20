import { Card } from '@/components/ui/Card';
import { MessageGroupInfo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  group: MessageGroupInfo;
  children: React.ReactNode;
  className?: string;
}

export function MessageGroup({ group, children, className }: Props) {
  return (
    <Card className={cn('group-card fade-in', className)} hover padding="lg">
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-3">
          <div className={cn('icon-container flex h-11 w-11 items-center justify-center rounded-2xl', group.color === 'gold' ? 'text-naif-goldDark' : 'text-naif-primary')}>
            <span className="text-lg font-bold">{group.title.slice(0, 1)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-naif-primary">{group.title}</h2>
            <p className="text-sm text-gray-500">{group.description}</p>
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
}
