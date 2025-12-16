import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Navbar() {
  const { userLogin, setUserLogin, userData } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("token");
    setUserLogin(null);
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-800 md:px-9">
        <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Social App
            </span>
          </Link>
          <div className="flex gap-3 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {userLogin ? (
              <>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      userData?.image
                        ? userData?.image?.url
                        : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    alt="user photo"
                  />
                </button>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {userData?.name}
                    </span>
                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                      {userData?.email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <span
                        onClick={handleLogOut}
                        className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <ul className="flex gap-4 text-white">
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
