import { images } from "@/data/images";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";
import { RidgeEdge } from "@/components/ui/Ridge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { Drift } from "@/components/motion/Drift";
import { cn } from "@/lib/cn";

/**
 * 07 — About Atlas. Ivory; the calmest section on the page. Text-led and asymmetric:
 * a narrow column of CONFIRMED facts at the left, one tall photograph at the right.
 * No stats, no timeline, no history, no people (none of that is verified).
 */
export function AboutAtlas({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const facts: { k: string; v: React.ReactNode }[] = [
    { k: "Based in", v: `${site.city}, ${site.country}` },
    { k: "What we offer", v: "Electric and hybrid vehicles" },
    { k: "Prices", v: "Shown openly, as advertised" },
    {
      k: "Talk to us",
      v: (
        <span className="flex flex-col gap-1">
          <a className="link-draw w-fit" href={`tel:${site.phone.e164}`}>
            {site.phone.display}
          </a>
          <a className="link-draw w-fit" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a className="link-draw w-fit break-all" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </span>
      ),
    },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={cn("relative bg-ivory text-forest", standalone && "pt-[calc(var(--header-h)+clamp(2rem,5vw,5rem))]")}
    >
      {!standalone && <RidgeEdge className="text-ivory" />}
      <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-6 gap-y-14 px-[var(--page-gutter)] pb-[clamp(5rem,11vw,11rem)] pt-[clamp(4rem,8vw,8rem)]">
        <div className="col-span-12 lg:col-span-6 xl:col-span-6">
          <Reveal onMount={standalone}>
            <p className="t-label flex items-center gap-4 text-moss">
              <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
              About Atlas
            </p>
          </Reveal>
          <Reveal delay={0.05} onMount={standalone}>
            <Heading
              id="about-heading"
              className="t-display mt-7 max-w-[16ch] text-[clamp(2.4rem,5.2vw,5rem)]"
            >
              An electric vehicle business in Kigali.
            </Heading>
          </Reveal>

          <Reveal delay={0.1} onMount={standalone}>
            <dl className="mt-[clamp(2.5rem,5vw,4.5rem)] max-w-[34rem] border-t border-forest/20">
              {facts.map((f) => (
                <div
                  key={f.k}
                  className="grid gap-x-4 gap-y-1.5 border-b border-forest/20 py-4 sm:grid-cols-[10rem_1fr]"
                >
                  <dt className="t-label pt-1 text-[0.62rem] text-moss">{f.k}</dt>
                  <dd className="text-[1.0625rem] leading-snug">{f.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-[1.0625rem] italic text-moss">{site.signOff}</p>
          </Reveal>
        </div>

        <div className="col-span-10 col-start-3 sm:col-span-8 sm:col-start-4 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          <Reveal y={40}>
            <figure>
              <div className="ridge-mask-top relative aspect-[4/5] w-full overflow-hidden bg-warm-grey">
                <Drift className="absolute inset-0" from={28} to={-28}>
                  <PhotoFrame image={images.aboutDetail} sizes="(min-width: 1024px) 34vw, 80vw" />
                </Drift>
              </div>
              <figcaption className="t-label mt-4 flex justify-between gap-4 text-[0.62rem] text-moss">
                <span>Electric and hybrid vehicles</span>
                <span>Kigali, Rwanda</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
