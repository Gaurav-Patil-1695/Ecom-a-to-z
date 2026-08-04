import api from './api';

const searchService = {
  search: (params) => api.get('/search', { params }),
  suggest: (params) => api.get('/search/suggest', { params }),
};

export default searchService;
