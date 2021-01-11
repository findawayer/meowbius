/**
 * Cat breeds
 * https://docs.thecatapi.com/api-reference/breeds/breeds-list
 */
export type CatBreed = {
  alt_names: string;
  experimental: number;
  hairless: number;
  hypoallergenic: number;
  id: string;
  life_span: string; // Range string of numbers `x - y`
  name: string;
  natural: number;
  origin: string;
  rare: number;
  reference_image_id: null;
  rex: number;
  short_legs: number;
  suppressed_tail: number;
  temperament: string;
  weight_imperial: string;
  wikipedia_url: string; // Link URL
};

/**
 * Cat-egories :smug:
 * https://docs.thecatapi.com/api-reference/categories/categories-list
 */
export type CatCategory = {
  id: number;
  name: string;
};

/**
 * Public cat images.
 * https://docs.thecatapi.com/api-reference/images/images-search
 */
export type CatImage = {
  id: string;
  url: string;
  categories: CatCategory[];
  breeds: CatBreed[];
};
