/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Location } from "../type";

type State = {
  exploreQuery: string;
  explorePlaces: Location[];
  showSidebar: boolean;
  itiHotels: any;
  itiRestaurants: any;
  itiAttrac: any;
  choices: any;
  itinerary: {};
  photoSearch: "";
};

type Action = {
  setExploreQuery: (exploreQuery: State["exploreQuery"]) => void;
  setExplorePlaces: (newPlaces: State["explorePlaces"]) => void;
  setShowSidebar: (showSidebar: State["showSidebar"]) => void;
  setItiHotels: (itiHotels: State["itiHotels"]) => void;
  setItiRestaurants: (itiRestaurants: State["itiRestaurants"]) => void;
  setItiAttrac: (itiAttrac: State["itiAttrac"]) => void;
  setChoices: (choices: State["choices"]) => void;
  setItinerary: (itinerary: State["itinerary"]) => void;
  setPhotoSearch: (photoSearch: State["photoSearch"]) => void;
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
  itiHotels: [],
  setItiHotels: (newItiHotels) => set(() => ({ itiHotels: newItiHotels })),
  itiRestaurants: [],
  setItiRestaurants: (newItiRestaurants) =>
    set(() => ({ itiRestaurants: newItiRestaurants })),
  itiAttrac: [],
  setItiAttrac: (newItiAttrac) => set(() => ({ itiAttrac: newItiAttrac })),
  choices: [],
  setChoices: (newChoices) => set(() => ({ choices: newChoices })),
  itinerary: {},
  setItinerary: (newItinerary) => set(() => ({ itinerary: newItinerary })),
  photoSearch: "",
  setPhotoSearch: (newPhotoSearch) =>
    set(() => ({ photoSearch: newPhotoSearch })),
}));

export default useStore;
