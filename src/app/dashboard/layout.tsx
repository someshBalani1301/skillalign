"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button, Badge, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import {
  UploadIcon,
  ScoreIcon,
  MatchIcon,
  EditIcon,
  ExportIcon,
} from "@/components/icons/NavigationIcons";
import { cn } from "@/utils/formatUtils";

const navigation = [
  {
    name: "Upload",
    href: ROUTES.DASHBOARD.UPLOAD,
    icon: UploadIcon,
  },
  {
    name: "ATS Score",
    href: ROUTES.DASHBOARD.SCORE,
    icon: ScoreIcon,
  },
  {
    name: "JD Match",
    href: ROUTES.DASHBOARD.JD_MATCH,
    icon: MatchIcon,
  },
  {
    name: "Bullet Improver",
    href: ROUTES.DASHBOARD.BULLET_IMPROVER,
    icon: EditIcon,
  },
  {
    name: "Export",
    href: ROUTES.DASHBOARD.EXPORT,
    icon: ExportIcon,
  },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md p-8">
            <div className="mb-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in to access the dashboard
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="secondary"
                size="lg"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push(ROUTES.HOME)}
                variant="outline"
                size="lg"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">SkillAlign</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <Icon />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-3">
            {isAuthenticated && user ? (
              <>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Account
                  </p>
                  <p className="mt-1 text-sm text-white font-medium truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <Badge
                      variant={
                        user.subscription.plan === "free" ? "neutral" : "info"
                      }
                      size="sm"
                      className={
                        user.subscription.plan === "free"
                          ? "bg-gray-700 text-gray-300"
                          : ""
                      }
                    >
                      {user.subscription.plan.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button onClick={logout} variant="danger" size="sm" fullWidth>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="secondary"
                size="sm"
                fullWidth
              >
                Sign In
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
}
