"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface SkillHeatmapProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export function SkillHeatmap({
  matchedSkills,
  missingSkills,
}: SkillHeatmapProps) {
  const allSkills = [
    ...matchedSkills.map((skill) => ({ name: skill, matched: true })),
    ...missingSkills.map((skill) => ({ name: skill, matched: false })),
  ];

  return (
    <Card variant="bordered" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Skill Heatmap</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Missing</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {allSkills.map((skill, idx) => (
          <Badge
            key={idx}
            variant={skill.matched ? "success" : "danger"}
            size="lg"
          >
            {skill.matched ? "✓" : "✗"} {skill.name}
          </Badge>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {matchedSkills.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Skills Matched</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {missingSkills.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Skills Missing</div>
        </div>
      </div>
    </Card>
  );
}
