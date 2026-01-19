"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface BlurredContentProps {
  children: ReactNode;
  isLocked: boolean;
  onUnlock: () => void;
  title?: string;
  description?: string;
}

export function BlurredContent({
  children,
  isLocked,
  onUnlock,
  title = "Unlock Full Analysis",
  description = "Get complete insights with detailed recommendations",
}: BlurredContentProps) {
  return (
    <div className="relative">
      {/* Content */}
      <div
        className={isLocked ? "blur-sm pointer-events-none select-none" : ""}
      >
        {children}
      </div>

      {/* Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <Button onClick={onUnlock} size="lg" className="shadow-lg">
              🔓 Unlock Now - Starting ₹99
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              ✓ Instant access · ✓ Money-back guarantee
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
