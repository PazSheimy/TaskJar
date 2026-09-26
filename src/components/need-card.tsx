import Link from "next/link";
import { Pill, statusTone } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";
import { formatPay, formatPlace, STATUS_LABEL, timeAgo } from "@/lib/format";
import type { NeedWithOwner } from "@/lib/types";

export function NeedCard({ need }: { need: NeedWithOwner }) {
  return (
    <li>
      <Link
        href={`/jobs/${need.id}`}
        className="block h-full border border-line bg-white p-4 transition-colors hover:border-ink"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{categoryLabel(need.category)}</Pill>
          {need.status !== "open" && (
            <Pill tone={statusTone(need.status)}>
              {STATUS_LABEL[need.status]}
            </Pill>
          )}
          <span className="ml-auto text-xs text-muted">
            {timeAgo(need.created_at)}
          </span>
        </div>
        <h3 className="mt-2 font-display text-lg leading-tight font-bold">
          {need.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
          <span className="font-semibold text-ink tabular-nums">
            {formatPay(need.pay_type, need.pay_amount)}
          </span>
          {need.when_text && <span>{need.when_text}</span>}
          <span>{formatPlace(need.zip, need.area)}</span>
          {need.owner?.name && <span>by {need.owner.name}</span>}
        </div>
      </Link>
    </li>
  );
}
