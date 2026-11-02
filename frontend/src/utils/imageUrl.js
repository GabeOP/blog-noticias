import API from '../axios/config';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const baseURL = API.defaults.baseURL || 'http://localhost:8080';
  const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBase}${cleanPath}`;
};

