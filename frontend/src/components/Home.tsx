import { Link, Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="py-4 home">
      <div className="flex flex-col items-center justify-center text-white bg-black mt-24">
        <h1 className="text-5xl max-w-[800px] font-bold text-center">
          Embark on your <span className="text-purple-400">Bhromon</span>
        </h1>
        <div className="mt-12">
          <Link
            to="/itinerary"
            className="py-3 px-6 bg-purple-600 rounded-3xl font-medium text-lg"
          >
            Generate a itinerary
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Home;
