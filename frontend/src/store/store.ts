import { create } from "zustand";
import type { Location } from "../type";

type State = {
  exploreQuery: string;
  explorePlaces: Location[];
  showSidebar: boolean;
};

type Action = {
  setExploreQuery: (exploreQuery: State["exploreQuery"]) => void;
  setExplorePlaces: (newPlaces: State["explorePlaces"]) => void;
  setShowSidebar: (showSidebar: State["showSidebar"]) => void;
};

const useStore = create<State & Action>((set) => ({
  exploreQuery: "",
  setExploreQuery: (newExQuery: string) =>
    set(() => ({ exploreQuery: newExQuery })),
  explorePlaces: [],
  setExplorePlaces: (newPlaces: Location[]) =>
    set(() => ({ explorePlaces: newPlaces })),
  showSidebar: true,
  setShowSidebar: (newShowSidebar: boolean) =>
    set(() => ({ showSidebar: newShowSidebar })),
}));

export default useStore;
