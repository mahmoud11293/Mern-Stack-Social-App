import React from "react";

export default function AppButton({ children, isLoading }) {
  return (
    <button
      disabled={isLoading}
      type="submit"
      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      {isLoading && <i className="fas fa-spinner fa-spin mx-3"></i>}
      {children}
    </button>
  );
}
