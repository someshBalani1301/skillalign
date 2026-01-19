import { Button } from "@/components/ui";

export function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-balance">
          Ready to Optimize Your Resume?
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-300 text-balance">
          Join thousands of job seekers who have improved their chances with
          SkillAlign.
        </p>
        <Button
          href="/dashboard/upload"
          variant="secondary"
          size="lg"
          className="mt-8 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Get Started for Free
        </Button>
      </div>
    </section>
  );
}
