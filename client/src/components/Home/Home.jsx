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
        console.log("token expired");
        if (error.response.status === 403) {
          await Axios.post("http://localhost:3001/token", {
            email: getIdentifier,
          });
          continue;
        }
      }
    }
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
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};
