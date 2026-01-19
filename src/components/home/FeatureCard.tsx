import { ReactNode } from "react";
import { Card } from "@/components/ui";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  colorClass: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: FeatureCardProps) {
  return (
    <Card variant="elevated" padding="lg" className="card-hover">
      <div
        className={`h-12 w-12 ${colorClass} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
    </Card>
  );
}
