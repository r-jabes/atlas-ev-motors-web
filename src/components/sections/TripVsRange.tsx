"use client";

import { useId, useState } from "react";
import { trips } from "@/data/mobility";
import { getFeatured, vehicleName, vehicles } from "@/data/vehicles";
import { RidgeEdge } from "@/components/ui/Ridge";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const EASE = "cubic-bezier(0.16,1,0.3,1)";

function Choices<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="t-label text-[0.62rem] text-moss">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
        {options.map((o) => (
          <label key={o.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className="inline-block border-b-2 border-transparent py-1 text-moss transition-colors group-hover:border-forest/30 group-hover:text-forest peer-checked:border-laterite-600 peer-checked:text-forest peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-forest">
              <span className="t-display block text-[clamp(1.5rem,2.4vw,2.1rem)]">{o.label}</span>
              {o.sub && (
                <>
                  {" "}
                  <span className="t-label block text-[0.58rem]">{o.sub}</span>
                </>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Bar({
  label,
  km,
  share,
  tone,
}: {
  label: string;
  km: number;
  share: number;
  tone: "accent" | "ink";
}) {
  const pct = Math.round(share * 100);
  const over = share > 1;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="t-label text-[0.62rem] text-moss">{label}</p>
        <p className="t-numeral text-[1.1rem]">
          {km} <span className="t-label text-[0.62rem]">km</span>
          <span className="t-label ml-3 text-[0.62rem] text-moss">
            {over ? "beyond range" : `${pct}% of range`}
          </span>
        </p>
      </div>
      <div className="relative mt-3 h-[10px] w-full bg-forest/12" role="presentation">
        <div
          className={cn("absolute inset-y-0 left-0 w-full origin-left", tone === "accent" ? "bg-laterite-600" : "bg-forest")}
          style={{
            transform: `scaleX(${Math.min(1, share)})`,
            transition: `transform 700ms ${EASE}`,
          }}
        />
        {over && (
          <span
            aria-hidden="true"
            className="absolute -right-px top-1/2 h-5 w-[3px] -translate-y-1/2 bg-laterite-600"
          />
        )}
      </div>
    </div>
  );
}

export function TripVsRange() {
  const uid = useId();
  const rated = vehicles.filter((v) => v.specs.range?.verified);
  const [trip, setTrip] = useState<string>(trips[0].name);
  const [slug, setSlug] = useState<string>(() => (rated.find((v) => v.slug === getFeatured().slug) ?? rated[0]).slug);

  const t = trips.find((x) => x.name === trip) ?? trips[0];
  const v = rated.find((x) => x.slug === slug) ?? rated[0];
  const range = v.specs.range!.value;
  const oneWay = t.km;
  const there = t.km * 2;
  const s1 = oneWay / range;
  const s2 = there / range;
  const short = there - range;

  return (
    <section
      id="trip-vs-range"
      aria-labelledby={`${uid}-h`}
      className="relative bg-ivory text-forest"
    >
      <RidgeEdge className="text-ivory" />
      <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-6 gap-y-14 px-[var(--page-gutter)] pb-[clamp(5rem,10vw,10rem)] pt-[clamp(4rem,8vw,8rem)]">
        <div className="col-span-12 lg:col-span-6">
          <Reveal>
            <p className="t-label flex items-center gap-4 text-moss">
              <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
              Trip against range
            </p>
          </Reveal>
          <h3 id={`${uid}-h`} className="t-display mt-6 text-[clamp(2.4rem,5vw,4.75rem)]">
            <MaskLines lines={["How far is", "the trip?"]} />
          </h3>

          <Reveal delay={0.1} className="mt-10 space-y-9">
            <Choices
              legend="From Kigali to"
              name={`${uid}-trip`}
              value={trip}
              onChange={setTrip}
              options={trips.map((x) => ({ value: x.name, label: x.name }))}
            />
            <Choices
              legend="In a"
              name={`${uid}-vehicle`}
              value={slug}
              onChange={setSlug}
              options={rated.map((x) => ({
                value: x.slug,
                label: vehicleName(x),
                sub: `Advertised up to ${x.specs.range!.value} km`,
              }))}
            />
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
          <Reveal y={32}>
            <p className="t-label text-[0.62rem] text-moss">About</p>
            <p className="t-numeral mt-1 text-[clamp(4.5rem,11vw,10rem)] leading-[0.9]" aria-hidden="true">
              {oneWay}
              <span className="t-label ml-3 text-[clamp(0.8rem,1.4vw,1.1rem)] text-moss">KM ONE WAY</span>
            </p>

            <div className="mt-8 space-y-7">
              <Bar label="One way" km={oneWay} share={s1} tone="accent" />
              <Bar label="There and back" km={there} share={s2} tone="ink" />
            </div>

            <p aria-live="polite" className="mt-8 max-w-[44ch] text-[1.0625rem] leading-relaxed text-charcoal">
              {t.name} is about {oneWay} km from Kigali. A {vehicleName(v)} advertises up to {range} km
              on a full battery, so one way uses about {Math.round(s1 * 100)}% of that and there and
              back about {Math.round(s2 * 100)}%.
              {short > 0 &&
                ` That is ${short} km more than the advertised range, so you would need to charge on the way.`}
            </p>

            <p className="mt-5 max-w-[48ch] text-[0.82rem] leading-relaxed text-moss">
              Advertised range comes from a standardised test. Real range will be lower in practice:
              speed, load, hills and air-conditioning all matter, so plan your charging. Distances
              are approximate road distances, rounded from published tables.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
