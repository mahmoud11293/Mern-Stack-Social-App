import React from "react";

export default function Error({ error }) {
  return <h1 className="text-red-500 text-center text-2xl">{error.message}</h1>;
}
