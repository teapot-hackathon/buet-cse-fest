import Searchbar from "./Searchbar";
import Map from "./Map";
import useStore from "../store/store";
import axios from "axios";
import type { Location } from "../type";
import { useState } from "react";

function Explore() {
  const exQuery = useStore((state) => state.exploreQuery);
  const setExQuery = useStore((state) => state.setExploreQuery);
  const exPlaces = useStore((state) => state.explorePlaces);
  const setExPlaces = useStore((state) => state.setExplorePlaces);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async () => {
    console.log("hello");
    const url = `http://172.28.31.123:8000/search?query=${exQuery}`;
    try {
      setIsSearching(true);
      const res = await axios.get(url);
      console.log(res);
      let { data } = res;
      setIsSearching(false);
      data = data.map((item: Location) => {
        const [lat, long] = item.coor.split(",");
        let tag = "";

        const category = item.category.toLowerCase();
        if (
          category.includes("hotel") ||
          category.includes("resort") ||
          category.includes("accomodation")
        ) {
          tag = "Hotel";
        } else if (category.includes("restaurant")) {
          tag = "Food";
        } else {
          tag = "Attraction";
        }

        return { ...item, lat: parseFloat(lat), long: parseFloat(long), tag };
      });

      setExPlaces(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="">
      <div className="py-1">
        <Searchbar
          text={exQuery}
          setText={setExQuery}
          handleSubmit={handleSubmit}
          loading={isSearching}
          placeholder="Places to go, things to do, hotels..."
        />
      </div>
      <Map markers={exPlaces} />
    </div>
  );
}
export default Explore;
