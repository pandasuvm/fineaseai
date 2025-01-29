import React, { useState } from "react";
import { db } from "../../firebase"; // Firebase Firestore
import { addDoc, collection } from "firebase/firestore"; // Firestore methods
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";

const JobPostForm = ({ closeForm, user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostJob = async () => {
    setLoading(true);
    try {
      // Save job data to Firestore
      await addDoc(collection(db, "jobs"), {
        title,
        description,
        location,
        postedBy: user.uid,
        postedOn: new Date(),
        salary: parseFloat(salary),
        jobType,
        skillsRequired: skillsRequired.split(",").map(skill => skill.trim()),
        applicants: [],
        status: "Open", // Default status
      });
      toast.success("Job posted successfully!", {
        icon: <AiOutlineCheckCircle />,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
      setSkillsRequired("");
      closeForm(); // Close the form after posting
    } catch (error) {
      toast.error(`Error: ${error.message}`, { icon: <AiOutlineWarning /> });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Post a New Job</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-3 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Job Description"
            className="w-full p-3 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Salary"
            className="w-full p-3 border border-gray-300 rounded"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <select
            className="w-full p-3 border border-gray-300 rounded"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Skills Required (comma separated)"
            className="w-full p-3 border border-gray-300 rounded"
            value={skillsRequired}
            onChange={(e) => setSkillsRequired(e.target.value)}
          />
        </div>

        <button
          onClick={handlePostJob}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        <button
          onClick={closeForm}
          className="w-full mt-4 bg-gray-600 text-white py-3 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default JobPostForm;
