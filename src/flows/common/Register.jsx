import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (userType === "job-seeker") {
      navigate("/job-seeker/questions");
    } else if (userType === "job-giver") {
      navigate("/job-giver/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="radio"
              name="userType"
              value="job-seeker"
              checked={userType === "job-seeker"}
              onChange={() => setUserType("job-seeker")}
              className="mr-2"
            />
            Job Seeker
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              name="userType"
              value="job-giver"
              checked={userType === "job-giver"}
              onChange={() => setUserType("job-giver")}
              className="mr-2"
            />
            Job Giver
          </label>
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}