import { create } from "zustand";

interface SideBarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const getFromLocal = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("sidebar") || "false");
  }
  return false;
};

export const useSideBar = create<SideBarState>((set) => ({
  isOpen: getFromLocal(),
  toggle: () => {
    set((state) => {
      const newState = !state.isOpen;
      localStorage.setItem("sidebar", JSON.stringify(newState));
      return { isOpen: newState };
    });
  },
  close: () => {
    set(() => {
      localStorage.setItem("sidebar", "false");
      return { isOpen: false };
    });
  },
}));