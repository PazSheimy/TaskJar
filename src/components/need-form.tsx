"use client";

import { useActionState } from "react";
import { saveNeed } from "@/actions/needs";
import { SubmitButton } from "@/components/submit-button";
import { Alert, Field, inputClass } from "@/components/ui";
import { CATEGORIES } from "@/lib/categories";
import type { FormState } from "@/lib/form";

export type NeedInitial = Partial<
  Record<
    | "id"
    | "title"
    | "category"
    | "description"
    | "zip"
    | "area"
    | "pay_type"
    | "pay_amount"
    | "when_text",
    string
  >
>;

const PAY_OPTIONS = [
  { value: "fixed", label: "Fixed price" },
  { value: "hourly", label: "Per hour" },
  { value: "offer", label: "Make me an offer" },
];

export function NeedForm({ initial = {} }: { initial?: NeedInitial }) {
  const [state, formAction] = useActionState<FormState, FormData>(saveNeed, null);
  const v = { ...initial, ...(state?.values ?? {}) };
  const isEdit = Boolean(initial.id);

  return (
    <form action={formAction} className="grid gap-5">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <Field label="What do you need done?" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          maxLength={100}
          defaultValue={v.title}
          placeholder="Mow the front and back lawn"
          className={inputClass}
        />
      </Field>

      <Field label="Category" htmlFor="category">
        <select
          id="category"
          name="category"
          required
          defaultValue={v.category ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Pick one
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Details"
        htmlFor="description"
        hint="size of the job, tools you have, anything a helper should know"
      >
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={2000}
          defaultValue={v.description}
          placeholder="Corner lot, about half an hour with a mower. I have the mower and gas."
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Zip code" htmlFor="zip" hint="optional, leave empty if it can be done remotely">
          <input
            id="zip"
            name="zip"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            defaultValue={v.zip}
            placeholder="5 digits"
            className={inputClass}
          />
        </Field>
        <Field label="Neighborhood" htmlFor="area" hint="optional">
          <input
            id="area"
            name="area"
            maxLength={60}
            defaultValue={v.area}
            placeholder="Palm Springs North"
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Pay</legend>
        <div className="flex flex-wrap gap-2">
          {PAY_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="cursor-pointer rounded-full border-2 border-line bg-white px-3.5 py-1.5 text-sm font-medium has-checked:border-green has-checked:bg-green has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-green has-focus-visible:ring-offset-2"
            >
              <input
                type="radio"
                name="pay_type"
                value={o.value}
                defaultChecked={(v.pay_type ?? "fixed") === o.value}
                className="sr-only"
              />
              {o.label}
            </label>
          ))}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="pay_amount" className="text-sm font-semibold">
            Amount in dollars
            <span className="ml-2 font-normal text-muted">
              leave empty if asking for offers
            </span>
          </label>
          <div className="flex max-w-48 items-center rounded-lg border-2 border-line bg-white focus-within:border-green">
            <span className="pl-3.5 text-muted">$</span>
            <input
              id="pay_amount"
              name="pay_amount"
              type="number"
              min={1}
              max={100000}
              step={1}
              defaultValue={v.pay_amount}
              placeholder="120"
              className="w-full bg-transparent px-2 py-2.5 text-base focus:outline-none"
            />
          </div>
        </div>
      </fieldset>

      <Field label="When" htmlFor="when_text" hint="e.g. Saturday morning, this week, flexible">
        <input
          id="when_text"
          name="when_text"
          maxLength={80}
          defaultValue={v.when_text}
          placeholder="Saturday morning"
          className={inputClass}
        />
      </Field>

      {state?.error && <Alert>{state.error}</Alert>}

      <SubmitButton pendingText={isEdit ? "Saving…" : "Posting…"}>
        {isEdit ? "Save changes" : "Post job"}
      </SubmitButton>
    </form>
  );
}
