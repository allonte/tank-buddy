interface CapacityLevel {
  percentage: number;
  height: number;
}

interface CapacityChartProps {
  levels: CapacityLevel[];
  currentLevel: number;
  maxHeight: number;
}

const CapacityChart = ({ levels, currentLevel, maxHeight }: CapacityChartProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Capacity Chart
      </h3>

      <div className="space-y-3">
        {levels.map((level, index) => {
          const isActive = currentLevel >= level.percentage;
          const isCurrent = Math.abs(currentLevel - level.percentage) < 5;

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-right">
                <span className={`font-mono text-sm font-semibold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                  {level.percentage}%
                </span>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 ${
                      isActive
                        ? level.percentage <= 10
                          ? "bg-danger"
                          : level.percentage <= 25
                          ? "bg-warning"
                          : "bg-tank-liquid"
                        : "bg-transparent"
                    }`}
                    style={{ width: `${level.percentage}%` }}
                  />
                </div>
                {isCurrent && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                )}
              </div>

              <div className="w-24 text-right">
                <span className={`font-mono text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {level.height} mm
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max Height:</span>
          <span className="font-mono text-foreground font-semibold">{maxHeight} mm</span>
        </div>
      </div>
    </div>
  );
};

export default CapacityChart;
