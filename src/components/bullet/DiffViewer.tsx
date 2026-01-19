"use client";

import Card from "../ui/Card";

interface DiffViewerProps {
  original: string;
  improved: string;
  title?: string;
}

export function DiffViewer({ original, improved, title }: DiffViewerProps) {
  return (
    <Card variant="bordered" padding="md">
      {title && (
        <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <span>❌</span>
            <span>Before</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
            {original}
          </div>
        </div>

        {/* After */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <span>✅</span>
            <span>After</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
            {improved}
          </div>
        </div>
      </div>
    </Card>
  );
}
