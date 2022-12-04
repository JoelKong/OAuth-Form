import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Login } from "./components/Login.jsx";

function App() {
  const ProtectedRoute = ({ children, user }) => {
    if (!user) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
