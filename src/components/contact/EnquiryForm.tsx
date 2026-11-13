"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  CONTACT_METHODS,
  emptyEnquiry,
  enquiryMailtoUrl,
  enquiryWhatsAppUrl,
  validateEnquiry,
  vehicleOptions,
  type ContactMethod,
  type EnquiryErrors,
  type EnquiryValues,
} from "@/lib/enquiry";

type Channel = "whatsapp" | "email";

const field =
  "w-full border-0 border-b border-forest/35 bg-transparent px-0 py-3 text-[1.0625rem] text-forest placeholder:text-moss/70 transition-[border-color,box-shadow] duration-300 focus:border-forest focus:shadow-[0_1px_0_0_var(--color-forest)] aria-[invalid=true]:border-laterite-600 aria-[invalid=true]:shadow-[0_1px_0_0_var(--color-laterite-600)]";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-label flex items-baseline justify-between text-[0.62rem] text-moss">
        <span>{label}</span>
        {optional && <span className="tracking-[0.08em] opacity-80">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.85rem] text-laterite-600">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Enquiry form. There is no backend: submitting opens WhatsApp or the user's email app with
 * the details already written, and says so plainly. It never claims the enquiry was "sent".
 */
export function EnquiryForm({ defaultVehicle }: { defaultVehicle?: string }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<EnquiryValues>(() => emptyEnquiry(defaultVehicle));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [opened, setOpened] = useState<{ channel: Channel; url: string; blocked: boolean } | null>(null);

  const id = (k: string) => `${uid}-${k}`;
  const set = <K extends keyof EnquiryValues>(k: K, v: EnquiryValues[K]) => {
    setValues((cur) => ({ ...cur, [k]: v }));
    if (k in errors) setErrors((cur) => ({ ...cur, [k]: undefined }));
  };

  function go(channel: Channel) {
    const found = validateEnquiry(values);
    setErrors(found);
    const first = (["name", "phone", "email"] as const).find((k) => found[k]);
    if (first) {
      setOpened(null);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const url = channel === "whatsapp" ? enquiryWhatsAppUrl(values) : enquiryMailtoUrl(values);
    // No "noopener" feature here: it makes window.open always return null, which would hide a
    // genuinely blocked popup. Severing the opener by hand keeps the same safety.
    if (channel === "email") {
      // A mailto: link hands off to the mail app in place; a new tab would flash empty on desktop.
      // The browser can't tell us whether a mail app exists, so the fallback link is always offered.
      window.location.href = url;
      setOpened({ channel, url, blocked: true });
      return;
    }
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    setOpened({ channel, url, blocked: !win });
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(values.method === "Email" ? "email" : "whatsapp");
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const emailFirst = values.method === "Email";
  const waBtn = (variant: "primary" | "text-dark") => (
    <button
      key="wa"
      type={emailFirst ? "button" : "submit"}
      onClick={emailFirst ? () => go("whatsapp") : undefined}
      className={buttonClasses(variant)}
    >
      <span className={cn(variant === "text-dark" && "link-draw pb-1")}>Continue on WhatsApp</span>
      <ArrowRight aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
    </button>
  );
  const mailBtn = (variant: "primary" | "text-dark") => (
    <button
      key="mail"
      type={emailFirst ? "submit" : "button"}
      onClick={emailFirst ? undefined : () => go("email")}
      className={buttonClasses(variant)}
    >
      <span className={cn(variant === "text-dark" && "link-draw pb-1")}>
        {emailFirst ? "Open email draft" : "Email instead"}
      </span>
      <ArrowRight aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
    </button>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={id("title")} className="space-y-7">
      <div>
        <h3 id={id("title")} className="t-h2 text-forest">
          Tell us what you’re looking for
        </h3>
        <p className="mt-2 max-w-[38ch] text-[0.95rem] leading-relaxed text-moss">
          Fill in the details and we’ll prepare your message. You send it from WhatsApp or your
          email app.
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field id={id("name")} label="Name" error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            required
            className={field}
          />
        </Field>
        <Field id={id("phone")} label="Phone" error={errors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+250 …"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id("phone")}-error` : undefined}
            required
            className={field}
          />
        </Field>
        <Field id={id("email")} label="Email" optional={values.method !== "Email"} error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            className={field}
          />
        </Field>
        <Field id={id("vehicle")} label="Vehicle">
          <div className="relative">
            <select
              id={id("vehicle")}
              name="vehicle"
              value={values.vehicle}
              onChange={(e) => set("vehicle", e.target.value)}
              className={cn(field, "cursor-pointer appearance-none pr-8")}
            >
              {vehicleOptions().map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              strokeWidth={1.5}
              className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-forest"
            />
          </div>
        </Field>
      </div>

      <fieldset>
        <legend className="t-label text-[0.62rem] text-moss">Best way to reach you</legend>
        <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
          {CONTACT_METHODS.map((m) => (
            <label key={m} className="group relative cursor-pointer">
              <input
                type="radio"
                name="method"
                value={m}
                checked={values.method === m}
                onChange={() => set("method", m as ContactMethod)}
                className="peer sr-only"
              />
              <span className="t-label inline-block border-b-2 border-transparent py-1.5 text-[0.72rem] tracking-[0.14em] text-moss transition-colors group-hover:text-forest peer-checked:border-laterite-600 peer-checked:text-forest peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-forest">
                {m}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id={id("message")} label="Message" optional>
        <textarea
          id={id("message")}
          name="message"
          rows={3}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Anything we should know: budget, timing, questions…"
          className={cn(field, "resize-y")}
        />
      </Field>

      <div aria-live="polite" className="text-[0.85rem] text-laterite-600">
        {errorCount > 0 && `Please check ${errorCount === 1 ? "the highlighted field" : "the highlighted fields"} above.`}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {emailFirst ? [mailBtn("primary"), waBtn("text-dark")] : [waBtn("primary"), mailBtn("text-dark")]}
      </div>

      <div role="status" aria-live="polite">
        {opened && (
          <p className="border-l-2 border-laterite-600 pl-4 text-[0.92rem] leading-relaxed text-charcoal">
            {opened.channel === "whatsapp" ? "WhatsApp" : "Your email app"} should now be open with your
            message ready. <strong className="font-semibold">Press send there. Nothing has been sent from
            this page.</strong>{" "}
            {opened.blocked && (
              <>
                It didn’t open?{" "}
                <a
                  className="link-draw font-semibold"
                  href={opened.url}
                  target={opened.channel === "whatsapp" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  Open it here
                </a>
                .
              </>
            )}
          </p>
        )}
      </div>

      <p className="text-[0.78rem] leading-relaxed text-moss">
        Or reach us directly:{" "}
        <a className="link-draw text-forest" href={`tel:${site.phone.e164}`}>
          {site.phone.display}
        </a>
        .
      </p>
    </form>
  );
}
