import useStore from "../store/store";
import { getTag } from "../util";
import Map from "./Map";

function ItiMap() {
  const itinerary = useStore((state) => state.itinerary);
  let markers = [];

  for (let i = 0; i < itinerary.days; i++) {
    markers.push(itinerary.itinerary[i].morning.place);
    markers.push(itinerary.itinerary[i].afternoon.activity);
    markers.push(itinerary.itinerary[i].afternoon.restaurant);
    markers.push(itinerary.itinerary[i].evening.activity);
    markers.push(itinerary.itinerary[i].evening.restaurant);
  }

  markers = markers.map((item: Location) => {
    const [lat, long] = item.coor.split(",");
    const tag = getTag(item.category.toLowerCase());

    return { ...item, lat: parseFloat(lat), long: parseFloat(long), tag };
  });

  console.log(markers);

  return (
    <div>
      <Map markers={markers} />
    </div>
  );
}
export default ItiMap;
