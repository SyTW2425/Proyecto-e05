import axios from 'axios';
import { defineStore } from 'pinia';


export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Array<any>,
  }),

  actions: {
    fetchActivities() {
      axios
        .get('http://localhost:5001/api/activities')
        .then((response) => {
          this.activities = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});