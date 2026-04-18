export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--aira-gold-pale)" }}
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "var(--aira-dark)" }}
      >
        <span
          className="font-display text-3xl font-semibold"
          style={{ color: "var(--aira-gold-light)" }}
        >
          A
        </span>
      </div>

      <h1
        className="font-display text-3xl font-semibold mb-2"
        style={{ color: "var(--aira-dark)" }}
      >
        You&apos;re Offline
      </h1>
      <p
        className="text-sm max-w-xs mb-8 leading-relaxed"
        style={{ color: "var(--aira-text)", opacity: 0.65 }}
      >
        AIRA needs an internet connection to work. Please check your network and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 rounded-full font-medium text-white transition-all hover:scale-105"
        style={{ background: "var(--aira-gold)" }}
      >
        Try Again
      </button>
    </div>
  );
}
