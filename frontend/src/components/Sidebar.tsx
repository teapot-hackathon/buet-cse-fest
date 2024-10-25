import { useState } from "react";
import { Map, Compass, Image, Sparkles } from "lucide-react";
import useStore from "../store/store";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("home");
  const showSidebar = useStore((state) => state.showSidebar);
  const location = useLocation();

  const menuItems = [
    { id: "itinerary", icon: Map, label: "Itinerary" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "photos", icon: Image, label: "Photos" },
    { id: "blog", icon: Sparkles, label: "Blog" },
  ];

  return (
    <aside
      className={
        "w-64 h-screen bg-white border-r border-gray-300 fixed top-[80px] left-0 transition-all sidebar z-[10000] shadow-xl" +
        ` ${showSidebar ? "translate-x-0" : "-translate-x-full"}`
      }
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`/${item.id}`}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-150 ease-in-out
                  ${
                    activeItem === item.id
                      ? "bg-purple-200 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
