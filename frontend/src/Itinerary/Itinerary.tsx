import { useState } from "react";
import ItiForm from "./ItiForm";

import React from "react";
import useStore from "../store/store";
import { Link } from "react-router-dom";

const Day = ({ day }) => {
  return (
    <div className="grid grid-cols-[100px_1fr] mb-6 border border-gray-200 rounded-lg">
      <div className="bg-gray-100 p-4 text-center font-bold text-lg border-r border-gray-200">
        DAY {day.day}
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Morning:</h3>
          <p className="text-gray-600">{day.morning.title}</p>
          <p className="text-gray-600">{day.morning.place.address}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Afternoon:</h3>
          <p className="text-gray-600">{day.afternoon.title}</p>
          <p className="text-gray-600 text-sm">
            Attraction: {day.afternoon.activity.title}
          </p>
          <p className="text-gray-600 text-sm">
            Restaurant: {day.afternoon.restaurant.title}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Evening:</h3>
          <p className="text-gray-600">{day.evening.title}</p>
          <p className="text-gray-600 text-sm">
            Attraction: {day.evening.activity.title}
          </p>
          <p className="text-gray-600 text-sm">
            Restaurant: {day.evening.restaurant.title}
          </p>
        </div>
      </div>
    </div>
  );
};

const TravelItinerary = () => {
  const itinerary = useStore((state) => state.itinerary);
  console.log(itinerary);
  return (
    <div className="max-w-3xl my-8 bg-white p-6 shadow-xl rounded-lg border border-neutral-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Travel Itinerary</h1>
        <p>
          {itinerary.query} - {itinerary.days} Day Trip
        </p>
      </div>

      {/* Details */}
      <div className="text-center mb-8 text-gray-600">
        <p>
          Hotel Address:{" "}
          <span className="font-medium">
            {itinerary.itinerary[0].morning.place.address}
          </span>
        </p>
      </div>

      {itinerary.itinerary.map((item, i) => (
        <Day
          day={item}
          key={i}
        />
      ))}

      {/* Add more day blocks as necessary */}
    </div>
  );
};

function Itinerary() {
  const [showForm, setShowForm] = useState(true);
  const itinerary = useStore((state) => state.itinerary);

  return (
    <div className="flex flex-col justify-center gap-4 py-6">
      <div className="flex justify-center gap-4">
        {itinerary.query && (
          <>
            <Link
              to="/blog"
              className=" bg-black text-white py-3 px-3 no-print font-semibold"
            >
              Generate a blog
            </Link>
            <Link
              to="/itinerary-map"
              className=" bg-purple-600 text-white py-3 px-3 no-print font-semibold"
            >
              Show on Map
            </Link>
            <button
              className="bg-black text-white py-3 px-3 no-print font-semibold"
              onClick={() => setShowForm(true)}
            >
              Generate Again
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center items-start gap-x-4">
        {!itinerary.query && <ItiForm set={setShowForm} />}
        {itinerary.query && <TravelItinerary />}
      </div>
    </div>
  );
}
export default Itinerary;
