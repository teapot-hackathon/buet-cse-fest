import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import marker from "../assets/marker.png";
import hotel from "../assets/hotel.png";
import food from "../assets/food.png";
import attraction from "../assets/attraction.png";
import ChangeView from "./ChangeView";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import type { Location } from "../type";

type Props = {
  markers: Location[];
};

function Map({ markers }: Props) {
  const customIcon = new Icon({
    iconUrl: marker,
    iconSize: [38, 38],
  });

  const icons = {
    attracion: new Icon({
      iconUrl: attraction,
      iconSize: [38, 38],
    }),
    food: new Icon({
      iconUrl: food,
      iconSize: [38, 38],
    }),
    hotel: new Icon({
      iconUrl: hotel,
      iconSize: [38, 38],
    }),
  };

  let mid, center;
  if (markers.length) {
    mid = markers[Math.floor(markers.length / 2)];
    center = [mid.lat, mid.long];
  }

  const bd = [23.7946963098031, 90.40126219418919];

  return (
    <MapContainer>
      <ChangeView
        center={markers.length ? (center as number[]) : bd}
        zoom={13}
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup chunkedLoading>
        {markers.map((att) => (
          <Marker
            key={att.id}
            position={[att.lat, att.long]}
            icon={customIcon}
            eventHandlers={{}}
          >
            <Popup>
              <div className="flex flex-col justify-start">
                <h2 className="font-bold text-xl">{att.title}</h2>
                <p className="text-xl flex gap-2 font-semibold">
                  <IoStar />
                  &#40;{att.stars}&#41;
                </p>
                <p className="text-neutral-600">{att.tag}</p>

                {att.completePhoneNumber && (
                  <p className="text-neutral-600">{att.completePhoneNumber}</p>
                )}
                {att.domain && (
                  <Link
                    className="text-blue-300"
                    to="/location"
                    state={att}
                  >
                    See more
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
export default Map;
