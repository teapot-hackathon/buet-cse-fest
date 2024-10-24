import { useMap } from "react-leaflet";

type Props = {
  center: number[];
  zoom: number;
};

function ChangeView({ center, zoom }: Props) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default ChangeView;
