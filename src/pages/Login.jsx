import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // State Variables
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobSeeker",
    phone: "",
    location: "",
    skills: "",
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  // Handle Login or Registration
  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCredential;
      let profilePhotoUrl = "";

      if (isNewUser) {
        // Create User
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const userId = userCredential.user.uid;

        // Upload Profile Photo if Exists
        if (formData.profilePhoto) {
          const storageRef = ref(storage, `profile_photos/${userId}`);
          await uploadBytes(storageRef, formData.profilePhoto);
          profilePhotoUrl = await getDownloadURL(storageRef);
        }

        // Save User Data in Firestore
        await setDoc(doc(db, "users", userId), {
          userId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
          location: formData.location,
          skills: formData.role === "jobSeeker" ? formData.skills.split(",") : [],
          profilePhoto: profilePhotoUrl,
          createdAt: new Date(),
        });

        // Redirect Based on Role
        navigate(formData.role === "jobSeeker" ? "/dashboard/jobseeker" : "/dashboard/employer");
      } else {
        // Sign In User
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userId = userCredential.user.uid;

        // Fetch User Role from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          navigate(userRole === "jobSeeker" ? "/dashboard/jobseeker" : "/dashboard/employer");
        } else {
          alert("User data not found.");
        }
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">{isNewUser ? "Register" : "Login"}</h2>

        {isNewUser && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-2 mb-2 border rounded"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-2 mb-2 border rounded"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full p-2 mb-2 border rounded"
              value={formData.location}
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full p-2 mb-2 border rounded"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="jobSeeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
            {formData.role === "jobSeeker" && (
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                className="w-full p-2 mb-2 border rounded"
                value={formData.skills}
                onChange={handleChange}
              />
            )}
            <input type="file" onChange={handleFileChange} className="w-full p-2 mb-2 border rounded" />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-blue-500 text-white p-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Processing..." : isNewUser ? "Register" : "Login"}
        </button>

        <p className="text-center mt-3 text-sm">
          {isNewUser ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => setIsNewUser(!isNewUser)}>
            {isNewUser ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
