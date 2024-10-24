import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className=" mx-auto py-4">
      <Outlet />
    </div>
  );
}
export default Home;
