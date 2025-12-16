import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer class="dark:bg-gray-900 rounded-base shadow-xs ">
      <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between px-6">
          <Link
            to="/"
            class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="../../../public/apple-app-store.jpg"
              class="h-7"
              alt="App logo"
            />
            <span class="text-heading self-center text-2xl font-semibold whitespace-nowrap">
              Social App
            </span>
          </Link>
          <span class="block text-sm text-body sm:text-center">
            © 2025{" "}
            <Link to="/" class="hover:underline">
              Social App
            </Link>
            . All Rights Reserved.
          </span>
          <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-body sm:mb-0">
            <li>
              <Link to="/" class="hover:underline me-4 md:me-6">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profile" class="hover:underline me-4 md:me-6">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
