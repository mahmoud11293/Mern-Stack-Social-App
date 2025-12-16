import { Outlet } from "react-router-dom";
import Footer from "./../Footer/Footer";
import Navbar from "./../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <main className="dark:bg-gray-950 dark:text-white">
        <Navbar />
        <div className="container mx-auto mt-16 min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </main>
    </>
  );
}
