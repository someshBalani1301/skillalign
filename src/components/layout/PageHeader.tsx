/**
 * Page Header Component - Reusable header for dashboard pages
 */

import Button from "@/components/ui/Button";
import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        {children}
      </div>
      {action && (
        <Button onClick={action.onClick} variant={action.variant || "outline"}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
