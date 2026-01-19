const stats = [
  { value: "95%", label: "ATS Compatibility" },
  { value: "<60s", label: "Analysis Time" },
  { value: "5+", label: "Optimization Tools" },
];

export function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-blue-600">
              {stat.value}
            </div>
            <div className="mt-2 text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
