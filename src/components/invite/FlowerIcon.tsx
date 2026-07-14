/**
 * Small single-flower line drawing shown before a deceased parent's name
 * (replaces the textual 故 marker). Inherits color via currentColor.
 */
export function FlowerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="고인"
      role="img"
      className={`inline-block h-3.5 w-3.5 align-[-0.15em] ${className}`}
    >
      {/* five petals around a small core */}
      <circle cx="12" cy="8" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 6.2c-1.1-2.4.4-4.2 0-4.2s1.1 1.8 0 4.2z" />
      <path d="M13.7 7.2c2.4-1 4-.2 3.8.2s-2.2.7-3.8-.2z" />
      <path d="M13.2 9.6c2 1.7 1.9 3.4 1.5 3.5s-1.8-1.5-1.5-3.5z" />
      <path d="M10.8 9.6c-.3 2-1.1 3.6-1.5 3.5s-.5-1.8 1.5-3.5z" />
      <path d="M10.3 7.2c-1.6.9-3.6.6-3.8.2s1.4-1.2 3.8-.2z" />
      {/* stem + leaf */}
      <path d="M12 10.5c0 4.5-.6 7.5-1.6 11" />
      <path d="M11.2 16.5c-1.8-.4-2.9-1.7-2.7-2.1s1.9-.1 2.7 2.1z" />
    </svg>
  );
}
