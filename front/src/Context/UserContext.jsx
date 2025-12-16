import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userLogin, setUserLogin] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUserLogin(token);
  }, []);

  async function getProfileData(userLogin) {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/profile`,
        {
          headers: {
            token: `testPrefix ${userLogin}`,
          },
        }
      );

      if (data.response.message === "success") {
        setUserData(data.response.user);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    getProfileData(localStorage.getItem("token"));
  }, []);

  return (
    <UserContext.Provider
      value={{ userLogin, setUserLogin, userData, getProfileData }}
    >
      {children}
    </UserContext.Provider>
  );
}
