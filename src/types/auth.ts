export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  subscription: UserSubscription;
}

export interface UserSubscription {
  plan: "free" | "single" | "weekly" | "monthly";
  status: "active" | "expired" | "cancelled";
  expiresAt?: Date;
  jdAnalysisCount: number; // For single plan
  maxJdAnalysis?: number; // For single plan
  paymentId?: string; // Razorpay payment ID
  orderId?: string; // Razorpay order ID
  purchasedAt?: Date; // When subscription was purchased
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}
