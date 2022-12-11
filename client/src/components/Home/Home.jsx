import { React, useState, useEffect } from "react";
import Axios from "axios";

export const Home = () => {
  //States
  const [user, setUser] = useState();

  async function getHomeData() {
    const getIdentifier = localStorage.getItem("email");

    while (true) {
      try {
        const getData = await Axios.get("http://localhost:3001/home", {
          headers: {
            Authorization: `Bearer ${getIdentifier}`,
          },
        });
        setUser(getData.data);
        break;
      } catch (error) {
        if (error.response.status === 403) {
          const generateToken = await Axios.post(
            "http://localhost:3001/token",
            {
              email: getIdentifier,
            }
          );
        }
      }
    }
  }

  async function handleLogOut() {
    await Axios.post("http://localhost:3001/logout", { email: user.email });
    localStorage.clear();
    window.location.href = "http://localhost:3000/";
  }

  useEffect(() => {
    getHomeData();
  }, []);

  if (user) {
    return (
      <div>
        <p>{user.firstName}</p>
        <p>{user.lastName}</p>
        <p>{user.email}</p>
        <p>{user.profilePicture}</p>
        <button onClick={() => handleLogOut()}>Logout</button>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};
