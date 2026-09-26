"use client";

import { useActionState } from "react";
import { saveOffer } from "@/actions/offers";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Field, inputClass } from "@/components/ui";
import { CATEGORIES } from "@/lib/categories";
import type { FormState } from "@/lib/form";

export type OfferInitial = Partial<
  Record<
    | "headline"
    | "categories"
    | "description"
    | "rate_text"
    | "zips"
    | "availability"
    | "active",
    string
  >
>;

export function OfferForm({
  initial = {},
  isEdit = false,
}: {
  initial?: OfferInitial;
  isEdit?: boolean;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(saveOffer, null);
  const v = { ...initial, ...(state?.values ?? {}) };
  const picked = new Set((v.categories ?? "").split(",").filter(Boolean));
  const active = v.active === undefined ? true : v.active === "on";

  return (
    <form action={formAction} className="grid gap-5">
      <Field label="Headline" htmlFor="headline" hint="what you do, in a few words">
        <input
          id="headline"
          name="headline"
          required
          maxLength={100}
          defaultValue={v.headline}
          placeholder="I clean houses and apartments"
          className={inputClass}
        />
      </Field>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">
          Categories
          <span className="ml-2 font-normal text-muted">pick all that apply</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.slug}
              className="cursor-pointer rounded-full border-2 border-line bg-white px-3.5 py-1.5 text-sm font-medium has-checked:border-green has-checked:bg-green has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-green has-focus-visible:ring-offset-2"
            >
              <input
                type="checkbox"
                name="categories"
                value={c.slug}
                defaultChecked={picked.has(c.slug)}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="About your work"
        htmlFor="description"
        hint="experience, what you bring, what you don’t do"
      >
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={2000}
          defaultValue={v.description}
          placeholder="Three years cleaning homes. I bring my own supplies. Deep cleans, move-outs, and weekly upkeep."
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your rate" htmlFor="rate_text" hint="optional">
          <input
            id="rate_text"
            name="rate_text"
            maxLength={60}
            defaultValue={v.rate_text}
            placeholder="$25/hr or from $100 per home"
            className={inputClass}
          />
        </Field>
        <Field label="Availability" htmlFor="availability" hint="optional">
          <input
            id="availability"
            name="availability"
            maxLength={80}
            defaultValue={v.availability}
            placeholder="Weekday mornings, all day Saturday"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Zip codes you serve" htmlFor="zips" hint="up to 10, separated by commas">
        <input
          id="zips"
          name="zips"
          required
          defaultValue={v.zips}
          placeholder="33012, 33014, 33016"
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="active"
          defaultChecked={active}
          className="h-4 w-4 accent-green"
        />
        Show my offer to people browsing helpers
      </label>

      {state?.error && <Alert>{state.error}</Alert>}

      <SubmitButton pendingText="Saving…">
        {isEdit ? "Save changes" : "Publish my offer"}
      </SubmitButton>
    </form>
  );
}
