import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "@/data/mobility";
import { RidgeEdge } from "@/components/ui/Ridge";
import { Button } from "@/components/ui/Button";
import { MaskLines, Reveal } from "@/components/motion/Reveal";

/**
 * Homepage teaser for /electric-mobility. The full guide (pinned chapters + trip-against-range) lives
 * on its own page; here it is one statement, four words and a way in. No duplicated content.
 */
export function ElectricTeaser() {
  return (
    <section id="electric-mobility" aria-labelledby="electric-teaser-heading" className="relative bg-ivory text-forest">
      <RidgeEdge className="text-ivory" />
      <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-6 gap-y-14 px-[var(--page-gutter)] pb-[clamp(5rem,11vw,11rem)] pt-[clamp(4rem,8vw,8rem)]">
        <div className="col-span-12 lg:col-span-6">
          <Reveal>
            <p className="t-label flex items-center gap-4 text-moss">
              <span className="block h-px w-10 bg-moss/60" aria-hidden="true" />
              Electric mobility
            </p>
          </Reveal>
          <h2 id="electric-teaser-heading" className="t-statement mt-7 text-[clamp(3.25rem,8vw,8rem)]">
            <MaskLines lines={["Live", "electric."]} />
          </h2>
          <Reveal delay={0.1} className="mt-8 max-w-[30rem]">
            <p className="t-body text-charcoal">
              Four things worth knowing before you make the switch, in plain language. General
              information only, with a small tool to test a trip against a vehicle&rsquo;s advertised range.
            </p>
            <div className="mt-8">
              <Button href="/electric-mobility" variant="text-dark">
                Read the guide
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
          <Reveal y={32}>
            <ol className="border-t border-forest/20">
              {chapters.map((c, i) => (
                <li key={c.word} className="border-b border-forest/20">
                  <Link
                    href="/electric-mobility"
                    className="group flex items-baseline gap-5 py-4 transition-[padding,color] duration-500 hover:pl-3 hover:text-laterite-600 focus-visible:pl-3 focus-visible:text-laterite-600 md:py-5"
                  >
                    <span className="t-label w-6 text-[0.62rem] text-laterite-600">0{i + 1}</span>
                    <span className="t-display flex-1 text-[clamp(2rem,3.6vw,3.5rem)]">{c.word}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 translate-y-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
