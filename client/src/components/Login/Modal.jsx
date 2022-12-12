import { React } from "react";

export const Modal = ({ alert }) => {
  return (
    <div className="login-form-modal login-form-modal__danger">
      <p>{alert.msg}</p>
    </div>
  );
};
