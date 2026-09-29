import axios from 'axios';
import type { PexelsResponse } from '../types';

export interface SearchFilters {
  orientation?: string;
  size?: string;
  color?: string;
}

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

if (!API_KEY) {
  console.warn("WARNING: VITE_PEXELS_API_KEY environment variable is not set. The application requires this key to fetch wallpapers.");
}

const BASE_URL = 'https://api.pexels.com/v1';

const pexelsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: API_KEY,
  },
});

export const getCuratedWallpapers = async (page = 1, perPage = 30): Promise<PexelsResponse> => {
  const response = await pexelsApi.get('/curated', {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const searchWallpapers = async (query: string, page = 1, perPage = 30, filters?: SearchFilters): Promise<PexelsResponse> => {
  const response = await pexelsApi.get('/search', {
    params: { query, page, per_page: perPage, ...filters },
  });
  return response.data;
};
