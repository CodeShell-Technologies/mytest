import axios from "axios";
import type { Setting } from "src/stores/SettingStore";
import { BASE_URL } from "~/constants/api";

const SETTING_KEY = "app_permissions";
export const fetchSettings = async (): Promise<Setting[]> => {
  try {
    const response = await axios.get<Setting[]>(`${BASE_URL}/setting/read`);
    return response.data;
  } catch (error) {
    console.log("Error fetching settings:", error);
    throw error;
  }
};

export const getStorageSettings = (): Setting[] | null => {
  if (typeof window === "undefined") return null;

  const storedData = localStorage.getItem(SETTING_KEY);
  return storedData ? JSON.parse(storedData) : null;
};

export const storeSettings = (settings: Setting[]): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(SETTING_KEY, JSON.stringify(settings));
};

export const clearStoredSettings = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SETTING_KEY);
};
