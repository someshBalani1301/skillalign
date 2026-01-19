/**
 * Custom hook for resume operations
 */

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export function useResume() {
  const { resume, setResume } = useApp();
  const router = useRouter();

  const hasResume = Boolean(resume);

  const redirectToUpload = () => {
    router.push(ROUTES.DASHBOARD.UPLOAD);
  };

  const updateResumeField = <K extends keyof typeof resume>(
    field: K,
    value: any,
  ) => {
    if (resume) {
      setResume({ ...resume, [field]: value });
    }
  };

  return {
    resume,
    setResume,
    hasResume,
    redirectToUpload,
    updateResumeField,
  };
}
