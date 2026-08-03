// Public barrel — re-export everything SEO pages and sitemap need
export { getAllCitySlugs, getCity, getAllCollegeSlugs, getCollege,
  getAllAreaSlugs, getArea, getCollegesInCity, getAreasInCity,
  getCollegesNearArea, getNeighborCities, getAllLiveCities,
  getAllLiveColleges, getAllLiveAreas } from "./seo";

export type { City, College, Area } from "./types";
export { getCityFaqs, getLocationFaqs } from "./faqs";
export type { Faq } from "./faqs";
