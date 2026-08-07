import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PseoHero from "@/components/pseo/PseoHero";
import PseoServicesList from "@/components/pseo/PseoServicesList";
import PseoFaq from "@/components/pseo/PseoFaq";
import PseoCrossLinks from "@/components/pseo/PseoCrossLinks";
import PseoCta from "@/components/pseo/PseoCta";
import PseoShopsList from "@/components/pseo/PseoShopsList";
import type { City, College, Area, LiveLocation } from "@/content/pseo/types";
import type { Faq } from "@/content/pseo/faqs";

type Props =
  | { kind: "city"; city: City }
  | { kind: "college"; college: College }
  | { kind: "area"; area: Area; liveLocations?: LiveLocation[] };

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
  const areaLiveLocations =
    props.kind === "area" ? props.liveLocations ?? [] : [];
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

        <PseoServicesList />

        {areaLiveLocations.length > 0 && (
          <PseoShopsList locations={areaLiveLocations} areaName={props.kind === "area" ? props.area.name : ""} />
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
