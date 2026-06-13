import { useSearchParams } from "react-router-dom";

export default function CliLogin() {
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  const googleLogin = () => {
    window.location.href = `http://localhost:5000/api/auth/google?redirect=${redirect}`;
  };

  const githubLogin = () => {
    window.location.href = `http://localhost:5000/api/auth/github?redirect=${redirect}`;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Login to DropUI</h2>

      <button onClick={googleLogin} className="bg-red-500 text-white px-4 py-2">
        Continue with Google
      </button>

      <button onClick={githubLogin} className="bg-gray-800 text-white px-4 py-2">
        Continue with GitHub
      </button>

      <p className="text-sm text-gray-500">
        (Email login can be added here too)
      </p>
    </div>
  );
}