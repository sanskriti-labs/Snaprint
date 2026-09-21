// Public barrel  --  re-export everything SEO pages and sitemap need
export { getAllCitySlugs, getCity, getCityName, getAllCollegeSlugs, getCollege,
  getAllAreaSlugs, getArea, getCollegesInCity, getAreasInCity,
  getCollegesNearArea, getNeighborCities, getAllLiveCities,
  getAllLiveColleges, getAllLiveAreas, getShopsNearCollege } from "./seo";

export type { City, College, Area, LiveLocation } from "./types";
export { getCityFaqs, getLocationFaqs } from "./faqs";
export type { Faq } from "./faqs";
