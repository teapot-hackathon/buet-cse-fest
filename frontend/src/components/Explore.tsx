import Searchbar from "./Searchbar";
import Map from "./Map";
import useStore from "../store/store";
import axios from "axios";
import type { Location } from "../type";
import { useState } from "react";
import { getTag } from "../util";

const BASE_URL = "http://172.28.31.123:8000";

function Explore() {
  const exQuery = useStore((state) => state.exploreQuery);
  const setExQuery = useStore((state) => state.setExploreQuery);
  const exPlaces = useStore((state) => state.explorePlaces);
  const setExPlaces = useStore((state) => state.setExplorePlaces);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async () => {
    console.log("hello");
    const url = `${BASE_URL}/search?query=${exQuery}`;
    try {
      setIsSearching(true);
      const res = await axios.get(url);
      console.log(res);
      let { data } = res;
      setIsSearching(false);
      data = data.map((item: Location) => {
        const [lat, long] = item.coor.split(",");
        const tag = getTag(item.category.toLowerCase());

        return { ...item, lat: parseFloat(lat), long: parseFloat(long), tag };
      });

      setExPlaces(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="py-6">
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
