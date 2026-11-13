import { images } from "@/data/images";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";
import { RidgeEdge } from "@/components/ui/Ridge";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { IllustrativeTag } from "@/components/ui/IllustrativeTag";
import { Button } from "@/components/ui/Button";
import { MaskLines, Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "./EnquiryForm";

/**
 * 08 — Contact & conversion. Forest over a dimmed dusk photograph. WhatsApp is the first action;
 * the ivory sheet carries the form; phone and email are large, plain links.
 * Used on the homepage (h2) and as the whole /contact page (h1, `standalone`).
 */
export function ContactSection({
  standalone = false,
  defaultVehicle,
}: {
  standalone?: boolean;
  defaultVehicle?: string;
}) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="on-dark relative isolate bg-forest text-ivory"
    >
      {!standalone && <RidgeEdge className="text-forest" />}

      {/* dusk photograph, tinted forest so the sheet and type own the page */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <PhotoFrame image={images.eveningCity} sizes="100vw" quality={60} hideTag grain={false} imgClassName="object-[60%_50%]" />
        <div className="absolute inset-0 bg-forest/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest via-forest/10 to-forest/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/25 to-transparent" />
      </div>
      <IllustrativeTag
        className={
          standalone
            ? "right-[var(--page-gutter)] top-[calc(var(--header-h)+0.75rem)]"
            : "right-[var(--page-gutter)] top-4"
        }
      />

      <div
        className={`mx-auto grid max-w-[1800px] grid-cols-12 gap-x-6 gap-y-12 px-[var(--page-gutter)] pb-[clamp(4rem,9vw,9rem)] ${
          standalone ? "pt-[calc(var(--header-h)+clamp(2.5rem,6vw,6rem))]" : "pt-[clamp(4rem,8vw,8rem)]"
        }`}
      >
        {/* Headline + primary action */}
        <div className="col-span-12 lg:col-span-6 lg:self-start">
          <Reveal onMount={standalone}>
            <p className="t-label flex items-center gap-4 text-sage">
              <span className="block h-px w-10 bg-sage/60" aria-hidden="true" />
              Enquire
            </p>
          </Reveal>
          <Heading
            id="contact-heading"
            className="t-statement mt-7 lg:text-[clamp(3.25rem,6.3vw,6.75rem)]"
          >
            <MaskLines lines={["Your next", "journey", "starts here."]} animateOnMount={standalone} />
          </Heading>

          <Reveal delay={0.1} onMount={standalone} className="mt-10 max-w-[28rem]">
            <p className="t-body text-ivory/85">
              The quickest way to reach us is a message. Ask about a vehicle, its availability, or
              what suits the way you drive.
            </p>
            <div className="mt-7">
              <Button href={whatsappLink()} variant="primary" external magnetic>
                Message on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Form sheet */}
        <div className="col-span-12 lg:col-span-6 lg:row-span-2 lg:row-start-1 xl:col-span-5 xl:col-start-8">
          <Reveal y={40}>
            <div className="bg-ivory p-[clamp(1.5rem,3.2vw,3rem)] text-forest">
              <EnquiryForm defaultVehicle={defaultVehicle} />
            </div>
          </Reveal>
        </div>

        {/* Plain contact links */}
        <div className="col-span-12 lg:col-span-6 lg:self-end">
          <Reveal delay={0.05}>
            <p className="t-label text-[0.62rem] text-sage">Or contact us directly</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  className="link-draw t-numeral text-[clamp(1.5rem,3vw,2.5rem)]"
                  href={`tel:${site.phone.e164}`}
                >
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a
                  className="link-draw break-all text-[clamp(1.125rem,2vw,1.75rem)]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </li>
            </ul>
            <p className="t-label mt-8 text-[0.62rem] text-sage">{site.city}, {site.country}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
