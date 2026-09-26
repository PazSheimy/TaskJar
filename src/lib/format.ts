export type PayType = "fixed" | "hourly" | "offer";

export function formatPay(payType: PayType, amount: number | null): string {
  if (payType === "offer" || amount == null) return "Make an offer";
  const dollars = `$${amount.toLocaleString("en-US")}`;
  return payType === "hourly" ? `${dollars}/hr` : dollars;
}

/** "33012 · Palm Springs North", "Palm Springs North", or "Remote or anywhere". */
export function formatPlace(zip: string | null, area: string | null): string {
  if (zip && area) return `${zip} · ${area}`;
  return zip || area || "Remote or anywhere";
}

/** A helper's service area from their zip list. */
export function formatZips(zips: string[], max = 3): string {
  if (zips.length === 0) return "Remote or anywhere";
  const shown = zips.slice(0, max).join(", ");
  return zips.length > max ? `${shown} +${zips.length - max}` : shown;
}

export const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  taken: "Taken",
  done: "Done",
  cancelled: "Cancelled",
};

/** "just now", "5 min ago", "3 h ago", "2 d ago", or a short date. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days} d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}
