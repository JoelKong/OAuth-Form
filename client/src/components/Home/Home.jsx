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
      <main className="background">
        <div className="home-profile-picture">
          <img
            src={
              user.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }
            alt="profilepicture"
            className="home-profile-picture__img"
          ></img>
        </div>

        <div className="home-center-div">
          <p>Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => handleLogOut()} className="home-logout-button">
            Logout
          </button>
        </div>
      </main>
    );
  } else {
    return <div>Loading...</div>;
  }
};
