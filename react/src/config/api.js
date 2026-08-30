const DEFAULT_API_BASE_URL = 'https://apireact1-1.onrender.com';

const normalizeBaseUrl = (value) => {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  return value.replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL);

export const getApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getUploadUrl = (filename) => {
  if (!filename) {
    return '';
  }

  const trimmed = String(filename).trim();
  const isAbsoluteUrl = /^(?:https?:)?\/\//i.test(trimmed);
  if (isAbsoluteUrl) {
    return trimmed;
  }

  return `${API_BASE_URL}/uploads/${trimmed}`;
};
