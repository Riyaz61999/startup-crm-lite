import { memo, useState, useCallback } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getIntensityClass = (total) => {
  if (total === 0) return 'bg-background';
  if (total <= 1) return 'bg-emerald-250/30 dark:bg-emerald-900/20';
  if (total <= 3) return 'bg-emerald-300/60 dark:bg-emerald-800/40';
  if (total <= 5) return 'bg-emerald-500/80 dark:bg-emerald-700/60';
  return 'bg-primary';
};

const HeatmapCell = memo(({ cell, onHover, onLeave }) => {
  if (!cell) {
    return <div className="w-full aspect-square rounded-sm bg-transparent" />;
  }

  return (
    <button
      type="button"
      className={`w-full aspect-square rounded-sm ${getIntensityClass(cell.total)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
      onMouseEnter={() => onHover(cell)}
      onFocus={() => onHover(cell)}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      aria-label={`${cell.date}: ${cell.leads} leads, ${cell.meetings} meetings, ${cell.calls} calls`}
    />
  );
});
HeatmapCell.displayName = 'HeatmapCell';

const ActivityHeatmap = memo(({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  const weeks = data?.weeks || [];
  const monthLabel = data?.monthLabel || 'This Month';

  const handleHover = useCallback((cell) => setTooltip(cell), []);
  const handleLeave = useCallback(() => setTooltip(null), []);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-dark">Activity Heatmap</h3>
            <p className="text-sm text-text-gray mt-0.5">{monthLabel} — leads, meetings & calls</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[280px]">
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div />
              {DAY_LABELS.map((day) => (
                <div key={day} className="text-[10px] font-medium text-text-gray text-center">
                  {day}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-[10px] font-medium text-text-gray flex items-center">
                  W{wi + 1}
                </div>
                {week.map((cell, di) => (
                  <HeatmapCell
                    key={`${wi}-${di}`}
                    cell={cell}
                    onHover={handleHover}
                    onLeave={handleLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {tooltip && (
          <div className="mt-4 rounded-xl bg-card border border-border text-text-dark text-xs px-4 py-3 inline-block shadow-sm">
            <p className="font-semibold mb-1">{tooltip.date}</p>
            <p>{tooltip.leads} Leads Created</p>
            <p>{tooltip.meetings} Meetings Scheduled</p>
            <p>{tooltip.calls} Calls Logged</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 text-[10px] text-text-gray">
          <span>Less</span>
          {['bg-background', 'bg-emerald-200/50', 'bg-emerald-350/70', 'bg-emerald-500/80', 'bg-primary'].map(
            (cls) => (
              <span key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
            )
          )}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;
