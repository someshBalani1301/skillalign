import { Card, Badge, Button } from "@/components/ui";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect to try out",
      features: [
        "Upload Resume (PDF/DOCX)",
        "Basic ATS Score",
        "Formatting Check",
        "Keyword Analysis",
      ],
      cta: "Get Started",
      href: "/dashboard/upload",
      highlighted: false,
    },
    {
      name: "Single JD",
      price: "₹99",
      period: "one-time",
      description: "Best for focused job hunt",
      features: [
        "Everything in Free",
        "Full JD Match Analysis",
        "Skill Gap Report",
        "Bullet Point Improvements",
        "ATS-Safe Export",
      ],
      cta: "Start Now",
      href: "/dashboard/upload",
      highlighted: true,
    },
    {
      name: "Weekly Pro",
      price: "₹299",
      period: "7 days",
      description: "Unlimited applications",
      features: [
        "Everything in Single JD",
        "Unlimited JD Analyses",
        "Priority Support",
        "Advanced Analytics",
        "Export All Formats",
      ],
      cta: "Go Pro",
      href: "/dashboard/upload",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant="elevated"
              padding="lg"
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "ring-2 ring-blue-500 transform scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="bg-blue-500 text-white">
                    🔥 Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                href={plan.href}
                variant={plan.highlighted ? "primary" : "outline"}
                size="lg"
                fullWidth
                className="mt-8 shadow-lg hover:shadow-xl"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            🔒 Secure Payment · 💯 Money Back Guarantee · ⚡ Instant Access
          </p>
        </div>
      </div>
    </section>
  );
}
