import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

export const Resetpassword = () => {
  const { isAllowed, setIsAllowed } = useState(false);
  const { id, token } = useParams();

  const sendParams = async () => {
    const getParams = await Axios.get(
      `http://localhost:3001/reset-password/${id}/${token}`
    );
    console.log(getParams.data);
    if (getParams.data) {
      setIsAllowed(true);
    }
  };

  useEffect(() => {
    sendParams();
  }, []);

  if (isAllowed) {
    return <div>sdf</div>;
  } else {
    return <div>Access Denied. Link has expired or invalid user.</div>;
  }
};
