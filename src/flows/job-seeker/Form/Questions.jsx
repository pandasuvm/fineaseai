import { useNavigate } from "react-router-dom";

export default function Questions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Job Seeker Questions</h1>
        <p className="mb-4">Additional questions for job seekers...</p>
        <button
          onClick={() => navigate("/job-seeker/home")}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}