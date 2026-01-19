"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  AuthState,
  LoginCredentials,
  SignupCredentials,
} from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateSubscription: (plan: string) => void;
  updateSubscriptionFromPayment: (subscriptionData: any) => void;
  incrementJDCount: () => void;
  hasPremiumAccess: () => boolean;
  canAnalyzeJD: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const AUTH_STORAGE_KEY = "skillalign_auth";
const USERS_STORAGE_KEY = "skillalign_users"; // Store all registered users

// Helper functions for user management
const getAllUsers = (): any[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUser = (userData: any) => {
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.email === userData.email);

  if (existingIndex >= 0) {
    users[existingIndex] = userData;
  } else {
    users.push(userData);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const findUserByEmail = (email: string, password: string) => {
  const users = getAllUsers();
  return users.find((u) => u.email === email && u.password === password);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const userData = JSON.parse(stored);
          // Convert date strings back to Date objects
          const user: User = {
            ...userData,
            createdAt: new Date(userData.createdAt),
            subscription: {
              ...userData.subscription,
              expiresAt: userData.subscription.expiresAt
                ? new Date(userData.subscription.expiresAt)
                : undefined,
            },
          };
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email and password
    const userData = findUserByEmail(credentials.email, credentials.password);

    if (!userData) {
      throw new Error("Invalid email or password");
    }

    // Convert stored data back to User object
    const user: User = {
      ...userData,
      createdAt: new Date(userData.createdAt),
      subscription: {
        ...userData.subscription,
        expiresAt: userData.subscription.expiresAt
          ? new Date(userData.subscription.expiresAt)
          : undefined,
      },
    };

    // Don't store password in active session
    delete (userData as any).password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (credentials: SignupCredentials) => {
    // TODO: Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const users = getAllUsers();
    const existingUser = users.find((u) => u.email === credentials.email);

    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    // Create new user
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password, // Store password for mock auth
      createdAt: new Date().toISOString(),
      subscription: {
        plan: "free" as const,
        status: "active" as const,
        jdAnalysisCount: 0,
      },
    };

    // Save to users database
    saveUser(userData);

    // Create user object without password
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(userData.createdAt),
      subscription: userData.subscription,
    };

    // Set active session (without password)
    const sessionData = { ...user, createdAt: user.createdAt.toISOString() };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateSubscription = (plan: string) => {
    if (!authState.user) return;

    const updatedUser: User = {
      ...authState.user,
      subscription: {
        plan: plan as any,
        status: "active",
        expiresAt:
          plan === "weekly"
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : plan === "monthly"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : undefined,
        jdAnalysisCount: 0,
        maxJdAnalysis: plan === "single" ? 1 : undefined,
      },
    };

    // Update active session
    const sessionData = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      subscription: {
        ...updatedUser.subscription,
        expiresAt: updatedUser.subscription.expiresAt?.toISOString(),
      },
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));

    // Update in users database
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.email === authState.user!.email);
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        subscription: {
          ...updatedUser.subscription,
          expiresAt: updatedUser.subscription.expiresAt?.toISOString(),
        },
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  const updateSubscriptionFromPayment = (subscriptionData: any) => {
    if (!authState.user) return;

    const updatedUser: User = {
      ...authState.user,
      subscription: {
        ...subscriptionData,
        expiresAt: subscriptionData.expiresAt
          ? new Date(subscriptionData.expiresAt)
          : undefined,
        purchasedAt: subscriptionData.purchasedAt
          ? new Date(subscriptionData.purchasedAt)
          : undefined,
      },
    };

    // Update active session
    const sessionData = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      subscription: {
        ...updatedUser.subscription,
        expiresAt: updatedUser.subscription.expiresAt?.toISOString(),
        purchasedAt: updatedUser.subscription.purchasedAt?.toISOString(),
      },
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));

    // Update in users database
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.email === authState.user!.email);
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        subscription: sessionData.subscription,
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  const incrementJDCount = () => {
    if (!authState.user) return;

    const updatedUser: User = {
      ...authState.user,
      subscription: {
        ...authState.user.subscription,
        jdAnalysisCount: authState.user.subscription.jdAnalysisCount + 1,
      },
    };

    // Update active session
    const sessionData = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      subscription: {
        ...updatedUser.subscription,
        expiresAt: updatedUser.subscription.expiresAt?.toISOString(),
        purchasedAt: updatedUser.subscription.purchasedAt?.toISOString(),
      },
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));

    // Update in users database
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.email === authState.user!.email);
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        subscription: sessionData.subscription,
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  const hasPremiumAccess = (): boolean => {
    if (!authState.user) return false;

    const { subscription } = authState.user;

    // Check if subscription is active
    if (subscription.status !== "active") return false;

    // Free plan has no premium access
    if (subscription.plan === "free") return false;

    // Check expiry for time-based plans
    if (subscription.expiresAt) {
      return new Date() < new Date(subscription.expiresAt);
    }

    // Single plan: check if analysis count is within limit
    if (subscription.plan === "single") {
      return subscription.jdAnalysisCount < (subscription.maxJdAnalysis || 1);
    }

    return true;
  };

  const canAnalyzeJD = (): boolean => {
    if (!authState.user) return false;

    const { subscription } = authState.user;

    // Free plan can see basic match score
    if (subscription.plan === "free") return true;

    // Premium plans can analyze
    return hasPremiumAccess();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateSubscription,
        updateSubscriptionFromPayment,
        incrementJDCount,
        hasPremiumAccess,
        canAnalyzeJD,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
