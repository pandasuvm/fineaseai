import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firebase Firestore
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; // Firestore methods
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCheckCircle, AiOutlineWarning, AiOutlineDelete, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import JobPostForm from "./jobPostForm"; // Import the JobPostForm component

const DashboardEmployer = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState(null); // Store selected job details
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [jobPostFormVisible, setJobPostFormVisible] = useState(false); // Track visibility of the job post form modal
  const [loading, setLoading] = useState(false);

  // Fetch posted jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), jobId: doc.id }))
        .filter((job) => job.postedBy === user.uid); // Only show jobs posted by the user
      setJobs(jobsData);
    };
    fetchJobs();
  }, [user.uid]);

  // Handle job details modal
  const handleJobClick = (jobId) => {
    const selectedJob = jobs.find((job) => job.jobId === jobId);
    setJobDetails(selectedJob);
    setApplicantModalOpen(true);
  };

  // Handle applicant action (approve or reject)
  const handleApplicantAction = async (jobId, userId, action) => {
    try {
      const jobDocRef = doc(db, "jobs", jobId);
      const updatedApplicants = jobDetails.applicants.map((applicant) =>
        applicant.userId === userId ? { ...applicant, status: action } : applicant
      );

      await updateDoc(jobDocRef, { applicants: updatedApplicants });
      toast.success(`Applicant ${action}d!`, { icon: <AiOutlineCheckCircle /> });
      setJobDetails((prevState) => ({ ...prevState, applicants: updatedApplicants }));
    } catch (error) {
      toast.error(`Error: ${error.message}`, { icon: <AiOutlineWarning /> });
    }
  };

  // Handle job status update (open/closed)
  const handleUpdateStatus = async (jobId, status) => {
    try {
      const jobDocRef = doc(db, "jobs", jobId);
      await updateDoc(jobDocRef, { status });
      toast.success(`Job status updated to ${status}!`, { icon: <AiOutlineCheckCircle /> });
    } catch (error) {
      toast.error(`Error: ${error.message}`, { icon: <AiOutlineWarning /> });
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast.success("Job deleted successfully!", { icon: <AiOutlineCheckCircle /> });
      setJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId)); // Remove deleted job from state
    } catch (error) {
      toast.error(`Error: ${error.message}`, { icon: <AiOutlineWarning /> });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <ToastContainer />
      
      {/* Job Postings Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job.jobId} className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-gray-500">{job.location} | {job.salary} USD | {job.jobType}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleJobClick(job.jobId)}
                    className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Applicants
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(job.jobId, job.status === "Open" ? "Closed" : "Open")}
                    className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {job.status === "Open" ? "Close Job" : "Reopen Job"}
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.jobId)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicant Details Modal */}
      {applicantModalOpen && jobDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Applicants for {jobDetails.title}</h2>
            {jobDetails.applicants.length === 0 ? (
              <p className="text-gray-500">No applicants yet.</p>
            ) : (
              <div>
                {jobDetails.applicants.map((applicant) => (
                  <div key={applicant.userId} className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg">
                    <div>
                      <h3 className="text-xl font-semibold">{applicant.name}</h3>
                      <p className="text-gray-600">{applicant.email}</p>
                      <p className="text-gray-500">Status: {applicant.status}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleApplicantAction(jobDetails.jobId, applicant.userId, "Approved")}
                        className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApplicantAction(jobDetails.jobId, applicant.userId, "Rejected")}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setApplicantModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Button to Post Job */}
      <button
        onClick={() => setJobPostFormVisible(true)}
        className="fixed bottom-6 left-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        <AiOutlinePlus className="text-3xl" />
      </button>

      {/* Show Job Post Form Modal */}
      {jobPostFormVisible && <JobPostForm closeForm={() => setJobPostFormVisible(false)} user={user} />}
    </div>
  );
};

export default DashboardEmployer;
