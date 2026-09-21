import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PseoHero from "@/components/pseo/PseoHero";
import PseoBody from "@/components/pseo/PseoBody";
import PseoServicesList from "@/components/pseo/PseoServicesList";
import PseoFaq from "@/components/pseo/PseoFaq";
import PseoCrossLinks from "@/components/pseo/PseoCrossLinks";
import PseoCta from "@/components/pseo/PseoCta";
import PseoShopsList from "@/components/pseo/PseoShopsList";
import type { City, College, Area, LiveLocation } from "@/content/pseo/types";
import type { Faq } from "@/content/pseo/faqs";

type Props =
  | { kind: "city"; city: City; liveLocations?: LiveLocation[] }
  | { kind: "college"; college: College; liveLocations?: LiveLocation[]; cityName: string }
  | { kind: "area"; area: Area; liveLocations?: LiveLocation[]; cityName: string };

type CrossLinks = {
  parentCity?: City;
  colleges?: College[];
  areas?: Area[];
  neighborCities?: City[];
};

export default function PseoPage({
  props,
  faqs,
  crossLinks,
  jsonLd,
}: {
  props: Props;
  faqs: Faq[];
  crossLinks?: CrossLinks;
  jsonLd?: object;
}) {
  const nearbyLocations = props.liveLocations ?? [];

  // Resolved display name + preposition for the ShopsList heading.
  // "in {area}" reads naturally for neighbourhoods and cities; "near
  // {college}" reads naturally for institutions. Centralising this so the
  // heading stays grammatical across all three kinds.
  const shopsListTarget =
    props.kind === "area"
      ? { name: props.area.name, preposition: "in" as const }
      : props.kind === "college"
        ? { name: props.college.shortName ?? props.college.name, preposition: "near" as const }
        : { name: props.city.name, preposition: "in" as const };

  // City name for the "View on Maps" search query. City pages are their own
  // city; area/college pages pass it explicitly (resolved via getCityName,
  // which  --  unlike the presence-gated parentCity cross-link  --  always
  // returns a name even for a college/area whose parent city isn't
  // published yet as its own pSEO page).
  const cityName = props.kind === "city" ? props.city.name : props.cityName;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 py-24 md:px-10">
        <div className="mb-16 border-b border-[#E8E6E0] pb-12">
          {props.kind === "city" && <PseoHero kind="city" city={props.city} />}
          {props.kind === "college" && <PseoHero kind="college" college={props.college} />}
          {props.kind === "area" && <PseoHero kind="area" area={props.area} />}
        </div>

        {props.kind === "area" && (
          <PseoBody kind="area" slug={props.area.slug} city={props.area.city} />
        )}
        {props.kind === "college" && (
          <PseoBody kind="college" slug={props.college.slug} city={props.college.city} />
        )}
        {props.kind === "city" && (
          <PseoBody kind="city" slug={props.city.slug} city={props.city.slug} />
        )}

        <PseoServicesList />

        {nearbyLocations.length > 0 && shopsListTarget && (
          <PseoShopsList
            locations={nearbyLocations}
            displayName={shopsListTarget.name}
            cityName={cityName}
            preposition={shopsListTarget.preposition}
          />
        )}

        {faqs.length > 0 && <PseoFaq faqs={faqs} />}

        <PseoCrossLinks
          parentCity={crossLinks?.parentCity}
          colleges={crossLinks?.colleges}
          areas={crossLinks?.areas}
          neighborCities={crossLinks?.neighborCities}
        />
      </main>

      <PseoCta />
      <Footer />
    </>
  );
}
