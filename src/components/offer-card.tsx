import Link from "next/link";
import { Avatar, Pill } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";
import type { OfferWithOwner } from "@/lib/types";

export function OfferCard({ offer }: { offer: OfferWithOwner }) {
  const name = offer.owner?.name ?? "Helper";
  return (
    <li>
      <Link
        href={`/helpers/${offer.id}`}
        className="flex h-full gap-4 border border-line bg-white p-4 transition-colors hover:border-ink"
      >
        <Avatar name={name} size={44} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-tight font-bold">
            {offer.headline}
          </h3>
          <p className="mt-1 text-sm text-ink-2">
            {name}
            {offer.rate_text ? ` · ${offer.rate_text}` : ""}
            {offer.zips.length ? ` · ${offer.zips.slice(0, 3).join(", ")}` : ""}
            {offer.zips.length > 3 ? ` +${offer.zips.length - 3}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {offer.categories.slice(0, 4).map((c) => (
              <Pill key={c}>{categoryLabel(c)}</Pill>
            ))}
          </div>
        </div>
      </Link>
    </li>
  );
}
