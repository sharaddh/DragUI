import {
  useAuth,
} from "../context/AuthContext";

export default function Topbar() {

  const {
    user,
    logout,
  } = useAuth();

  return (

    <div className="h-16 border-b flex justify-between items-center px-6">

      <div>
        Welcome,
        {" "}
        {user?.adminId}
      </div>

      <button
        onClick={logout}
      >
        Logout
      </button>

    </div>

  );

}