// ApplyButton.jsx
import React from "react";
import { db } from "../firebase"; // Firebase Firestore
import { doc, updateDoc } from "firebase/firestore"; // Firestore methods
import { toast } from "react-toastify"; // Import toast for notifications
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai"; // Success and Error Icons

const ApplyButton = ({ jobId, userId }) => {
  const handleApplyForJob = async () => {
    try {
      const jobDocRef = doc(db, "jobs", jobId);
      const jobDocSnap = await getDocs(jobDocRef);

      if (jobDocSnap.exists()) {
        const jobData = jobDocSnap.data();
        const updatedApplicants = [
          ...jobData.applicants,
          { userId, status: "Pending" }, // Add the userId with Pending status
        ];

        await updateDoc(jobDocRef, { applicants: updatedApplicants });

        toast.success("Applied for the job successfully!", {
          icon: <AiOutlineCheckCircle />,
        });
      }
    } catch (error) {
      toast.error(`Error applying for job: ${error.message}`, {
        icon: <AiOutlineWarning />,
      });
    }
  };

  return (
    <button
      onClick={handleApplyForJob}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Apply
    </button>
  );
};

export default ApplyButton;
