"use client";

export default function AnimatedBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${isDark ? "gradient-bg" : "light-gradient-bg"}`} />

      {/* Floating Orbs */}
      <div
        className="float-1 absolute top-1/4 left-1/4 rounded-full opacity-20 blur-3xl"
        style={{
          width: "400px", height: "400px",
          background: isDark
            ? "radial-gradient(circle, #7C3AED, transparent)"
            : "radial-gradient(circle, #a855f7, transparent)",
        }}
      />
      <div
        className="float-2 absolute bottom-1/4 right-1/4 rounded-full opacity-15 blur-3xl"
        style={{
          width: "350px", height: "350px",
          background: isDark
            ? "radial-gradient(circle, #4F46E5, transparent)"
            : "radial-gradient(circle, #818cf8, transparent)",
        }}
      />
      <div
        className="float-3 absolute top-1/2 right-1/3 rounded-full opacity-10 blur-3xl"
        style={{
          width: "250px", height: "250px",
          background: isDark
            ? "radial-gradient(circle, #EC4899, transparent)"
            : "radial-gradient(circle, #f472b6, transparent)",
        }}
      />

      {/* Stars — Dark only */}
      {isDark && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.1,
                animation: `fadeIn ${Math.random() * 3 + 1}s ease infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
