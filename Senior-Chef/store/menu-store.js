import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const menuData = ref({});
  const menu2Data = ref([]);
  const menu3Data = ref({});

  return { menuData, menu2Data, menu3Data};
})