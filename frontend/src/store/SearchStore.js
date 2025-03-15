import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: ''
  }),
  actions: {
    setQuery(newQuery) {
      this.query = newQuery;
    }
  }
});
