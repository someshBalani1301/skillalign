import { Card } from "@/components/ui";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: "blue" | "green" | "purple";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  color,
}: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <Card
      variant="elevated"
      padding="md"
      className={`bg-gradient-to-br ${colorClasses[color]} text-white`}
    >
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="mt-2 text-4xl font-bold">{value}</p>
      <p className="mt-1 text-sm opacity-90">{subtitle}</p>
    </Card>
  );
}
