import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillAlign - AI-Powered Resume Optimization & ATS Score Analysis",
  description:
    "Optimize your resume for Applicant Tracking Systems, match job descriptions, improve bullet points, and land your dream job faster with SkillAlign.",
  keywords: [
    "resume optimization",
    "ATS score",
    "job description match",
    "career tools",
    "resume builder",
    "AI resume",
  ],
  authors: [{ name: "SkillAlign Team" }],
  creator: "SkillAlign",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillalign.com",
    title: "SkillAlign - AI-Powered Resume Optimization",
    description:
      "Beat the ATS and land your dream job with AI-powered resume optimization.",
    siteName: "SkillAlign",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillAlign - AI-Powered Resume Optimization",
    description:
      "Beat the ATS and land your dream job with AI-powered resume optimization.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
