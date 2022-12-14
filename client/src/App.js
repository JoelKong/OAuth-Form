import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Login } from "./components/Login/Login.jsx";
import { Home } from "./components/Home/Home.jsx";
import { Forgetpassword } from "./components/Login/Forgetpassword.jsx";
import { Resetpassword } from "./components/Login/Resetpassword.jsx";

let account = localStorage.getItem("email");

function App() {
  const ProtectedRoute = ({ children, user }) => {
    if (!user) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId={process.env.CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="forgetpassword" element={<Forgetpassword />} />
        <Route path="reset-password/:id/:token" element={<Resetpassword />} />
        <Route
          path="home"
          element={
            <ProtectedRoute user={account}>
              <Home user={account} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
