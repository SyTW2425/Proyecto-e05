import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

interface Alert {
  message: string;
  type: 'alert-success' | 'alert-danger';
}

export const useAlertStore = defineStore({
  id: 'alert',
  state: () => ({
    alert: null as Alert | null,
  }),
  actions: {
    success(message: string) {
      const toast = useToast();
      toast.success(message);
      this.alert = { message, type: 'alert-success' };
    },
    error(message: string) {
      const toast = useToast();
      toast.error(message);
      this.alert = { message, type: 'alert-danger' };
    },
    clear() {
      this.alert = null;
    },
  },
});