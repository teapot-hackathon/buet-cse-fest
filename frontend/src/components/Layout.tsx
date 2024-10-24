import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="App mt-[80px]">
      <Outlet />
    </main>
  );
};

export default Layout;
