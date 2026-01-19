import { Card } from "@/components/ui";

interface ExportOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: "red" | "blue" | "green" | "gray";
}

export default function ExportOption({
  title,
  description,
  icon,
  onClick,
  color,
}: ExportOptionProps) {
  const colorClasses = {
    red: "bg-red-50 border-red-200 hover:bg-red-100 text-red-600",
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600",
    green: "bg-green-50 border-green-200 hover:bg-green-100 text-green-600",
    gray: "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-6 border-2 rounded-lg transition-all group w-full ${colorClasses[color]}`}
    >
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
    </button>
  );
}
