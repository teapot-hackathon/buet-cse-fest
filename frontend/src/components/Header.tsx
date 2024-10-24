import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import useStore from "../store/store";

export default function Header() {
  const showSidebar = useStore((state) => state.showSidebar);
  const setShowSidebar = useStore((state) => state.setShowSidebar);

  return (
    <header className="bg-black text-white h-[80px] fixed top-0 left-0 w-full z-50">
      <div className="relative">
        <button
          className="left-6 top-[25px] absolute text-3xl"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        >
          <GiHamburgerMenu />
        </button>
        <div className="max-w-[1200px] w-[90%] mx-auto px-4 py-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold"
          >
            BHROMON
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-white border border-white hover:bg-primary-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary text-black font-semibold"
                  onClick={() => console.log("Log in clicked")}
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-primary-foreground text-primary hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary font-semibold"
                  onClick={() => console.log("Sign up clicked")}
                >
                  Login
                </Link>
              </li>
              <li></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
