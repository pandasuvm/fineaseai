import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
        <Link
          to="/register"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 block text-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}