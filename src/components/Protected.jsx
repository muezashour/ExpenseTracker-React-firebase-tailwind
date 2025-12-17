import { Navigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa";

const Protected = ({ children }) => {
    const { user, authResolved, loading } = UserContext();


if (!authResolved || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <FaSpinner className="text-6xl text-gray-400 animate-spin " />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;
