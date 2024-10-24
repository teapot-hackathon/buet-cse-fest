import { useState } from "react";
import ItiForm from "./ItiForm";

import React from "react";

const TravelItinerary = () => {
  return (
    <div className="max-w-3xl mx-auto my-8 bg-white p-6 shadow-lg rounded-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Travel Itinerary</h1>
        <p>(Paris, France — 5 Day Trip)</p>
      </div>

      {/* Details */}
      <div className="text-center mb-8 text-gray-600">
        <p>
          Flight #: <span className="font-medium">1234 56789</span>
        </p>
        <p>
          Hotel Address:{" "}
          <span className="font-medium">
            123 Anywhere St, Any City ST 12345
          </span>
        </p>
        <p>
          Arrival: <span className="font-medium">June 1, 2023</span>
        </p>
        <p>
          Departure: <span className="font-medium">June 5, 2023</span>
        </p>
      </div>

      {/* Day 1 */}
      <div className="grid grid-cols-[100px_1fr] mb-6 border border-gray-200 rounded-lg">
        <div className="bg-gray-100 p-4 text-center font-bold text-lg border-r border-gray-200">
          DAY 1
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Morning:</h3>
            <p className="text-gray-600">Arrival & hotel check-in</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Afternoon:</h3>
            <p className="text-gray-600">
              Visit the Eiffel Tower & grab some lunch
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Evening:</h3>
            <p className="text-gray-600">
              Explore the Louvre Museum & have dinner
            </p>
          </div>
        </div>
      </div>

      {/* Day 2 */}
      <div className="grid grid-cols-[100px_1fr] mb-6 border border-gray-200 rounded-lg">
        <div className="bg-gray-100 p-4 text-center font-bold text-lg border-r border-gray-200">
          DAY 2
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Morning:</h3>
            <p className="text-gray-600">
              Have breakfast & stroll through Montmartre / visit the Sacré-Coeur
              Basilica
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Afternoon:</h3>
            <p className="text-gray-600">
              Visit the Notre-Dame Cathedral and Île de la Cité & have lunch
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Evening:</h3>
            <p className="text-gray-600">
              Enjoy a dinner cruise on the Seine River
            </p>
          </div>
        </div>
      </div>

      {/* Add more day blocks as necessary */}
    </div>
  );
};

function Itinerary() {
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="flex justify-center">
      <div>{showForm && <ItiForm />}</div>
      <TravelItinerary />
    </div>
  );
}
export default Itinerary;
