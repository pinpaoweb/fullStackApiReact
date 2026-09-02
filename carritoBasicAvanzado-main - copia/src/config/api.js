const defaultApiBaseUrl = 'https://apireact1-1.onrender.com';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

export const getApiUrl = (path = '') => {
  const cleanBaseUrl = apiBaseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

export const getUploadUrl = (filename = '') => {
  if (!filename) {
    return '';
  }

  return getApiUrl(`/uploads/${filename}`);
};

export default apiBaseUrl;
