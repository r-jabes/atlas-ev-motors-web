import Link from "next/link";
import { nav, site } from "@/data/site";
import { vehicles, vehicleName } from "@/data/vehicles";
import { Wordmark } from "@/components/ui/Wordmark";
import { RidgeEdge } from "@/components/ui/Ridge";
import { FooterWordmark } from "@/components/sections/FooterWordmark";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="on-dark relative bg-charcoal text-ivory">
      <RidgeEdge className="text-charcoal" />
      <div className="mx-auto max-w-[1800px] px-[var(--page-gutter)] pt-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Wordmark className="origin-left scale-125" />
            <p className="t-body mt-8 max-w-[30ch] text-muted-dark">
              Electric vehicles in {site.city}, {site.country}.
            </p>
            <p className="mt-5 text-[1.0625rem] italic text-sage">{site.signOff}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-5">
            <p className="t-label text-[0.62rem] text-sage">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-draw text-[1.05rem]">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="link-draw text-[1.05rem]">
                  Enquire
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Vehicles" className="md:col-span-3 md:col-start-7">
            <p className="t-label text-[0.62rem] text-sage">Vehicles</p>
            <ul className="mt-4 space-y-2.5">
              {vehicles.map((v) => (
                <li key={v.slug}>
                  <Link href={`/vehicles/${v.slug}`} className="link-draw text-[1.05rem]">
                    {v.year} {vehicleName(v)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3 md:col-start-10">
            <p className="t-label text-[0.62rem] text-sage">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[1.05rem]">
              <li>
                <a className="link-draw" href={`tel:${site.phone.e164}`}>
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a className="link-draw break-all" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="link-draw" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/12 pt-6 text-[0.8rem] text-muted-dark md:flex-row md:justify-between">
          <p>
            Images marked <span className="text-ivory">Illustrative</span> do not show Atlas
            vehicles, customers or locations.
          </p>
          <p>Prices and availability as advertised by Atlas; please enquire to confirm.</p>
        </div>

        <FooterWordmark />
      </div>
    </footer>
  );
}
