import { CAT_API_ALL_IMAGES_URI } from '../config/the-cat-api';
import type { CatImage } from '../models/the-cat-api';
import type { QueryParameters } from '../utils';
import { toQuery } from '../utils';

const queryTheCatApi = async (
  uri: string,
  parameters?: QueryParameters,
): Promise<Response | never> => {
  const apiKey = process.env.REACT_APP_THE_CAT_API_KEY;
  // API Key check.
  if (!apiKey) {
    throw new Error(`The Cat API requires a key.`);
  }
  const fullUri = uri + toQuery(parameters);
  const response = await fetch(fullUri, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  });
  // Check error.
  if (!response.ok) {
    throw new Error(`뭔가가 잘못됐군요?`);
  }
  // Return the succesful response.
  return response;
};

/**
 * Request cat images from public API.
 * @api https://docs.thecatapi.com/api-reference/images/images-search
 */

export type GetCatImageOptions = {
  size?: 'full' | 'med' | 'small' | 'thumb';
  order?: 'RANDOM' | 'ASC' | 'DESC';
  limit?: number;
  page?: number;
  category_ids?: number[];
  format?: string;
  breed_id?: string;
};

export const getCatImages = async (
  options?: GetCatImageOptions,
): Promise<CatImage[] | never> => {
  const response = await queryTheCatApi(CAT_API_ALL_IMAGES_URI, options);
  const data: CatImage[] = await response.json();
  return data;
};
