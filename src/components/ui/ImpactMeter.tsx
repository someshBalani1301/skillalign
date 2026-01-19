interface ImpactMeterProps {
  impact: "low" | "medium" | "high";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ImpactMeter({
  impact,
  showLabel = true,
  size = "md",
}: ImpactMeterProps) {
  const config = {
    low: {
      color: "bg-yellow-500",
      label: "Low Impact",
      width: "33%",
      icon: "📊",
    },
    medium: {
      color: "bg-orange-500",
      label: "Medium Impact",
      width: "66%",
      icon: "📈",
    },
    high: {
      color: "bg-green-500",
      label: "High Impact",
      width: "100%",
      icon: "🚀",
    },
  };

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const currentConfig = config[impact];

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            {currentConfig.icon} {currentConfig.label}
          </span>
          <span className="text-gray-500 text-xs">{currentConfig.width}</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${currentConfig.color} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: currentConfig.width }}
        />
      </div>
    </div>
  );
}
