import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

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
    // If needed, display image preview in the state
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePhoto: reader.result, // store image URL in the state
        }));
      };
      reader.readAsDataURL(file); // Read file as data URL for preview
    }
  };

  const removeImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: null, // Remove the image by setting it to null
    }));
  };

  // Handle Login or Registration
  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCredential;
      let profilePhotoUrl = "";

      if (isNewUser) {
        // Create User
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
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
          skills:
            formData.role === "jobSeeker" ? formData.skills.split(",") : [],
          profilePhoto: profilePhotoUrl,
          createdAt: new Date(),
        });

        // Redirect Based on Role
        navigate(
          formData.role === "jobSeeker"
            ? "/dashboard/jobseeker"
            : "/dashboard/employer"
        );
      } else {
        // Sign In User
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const userId = userCredential.user.uid;

        // Fetch User Role from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          navigate(
            userRole === "jobSeeker"
              ? "/dashboard/jobseeker"
              : "/dashboard/employer"
          );
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
    <div className="flex min-h-screen bg-[#F7F6F9] font-poppins">
      {/* Left Section */}
      <div className="w-2/5 bg-white flex flex-col justify-between p-0 pl-2 pr-2">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-left pl-16 pr-16">
            <h2 className="text-4xl font-bold mb-8 ">
              Welcome to <span className="text-[#2E3192]">JobSeeker</span>
            </h2>
            <p className=" text-gray-400 text-left">
              Fill out your personal details to get verified and discover local
              job opportunities and build a stronger community.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="components/Images/Login.png"
            alt="Bottom Image"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-3/5 flex items-center justify-center">
        <div className="w-[80%] max-w-3xl min-h-[70vh] overflow-scroll max-h-[70vh] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-left mb-8">
            {isNewUser ? "Register" : "Login"}
          </h2>

          {/* Conditional Rendering for Register Fields */}
          {isNewUser && (
            <>
              <div className="w-full">
                

                <div className="flex gap-8 mb-4">
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                </div>


                {/* Row 1 */}

                <div className="flex gap-8 mb-4">
                  <div className="flex flex-col w-[48%] gap-2">
                    <label htmlFor="name" className="font-semibold text-lg">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-[48%] gap-2">
                    <label htmlFor="phone" className="font-semibold text-lg">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex gap-8 mb-4">
                  <div className="flex flex-col w-[48%] gap-2">
                    <label htmlFor="location" className="font-semibold">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-[48%] gap-2">
                    <label htmlFor="role" className="font-semibold text-lg">
                      Role
                    </label>
                    <select
                      name="role"
                      className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="jobSeeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                </div>

                {/* Row 3 (conditional rendering based on role) */}
                {formData.role === "jobSeeker" && (
                  <div className="flex gap-8 mb-4">
                    <div className="flex flex-col w-[100%] gap-2">
                      <label htmlFor="skills" className="font-semibold text-lg">
                        Skills
                      </label>
                      <input
                        type="text"
                        name="skills"
                        placeholder="Skills (comma separated)"
                        className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* File Input Row */}
                <div className="flex flex-col w-full gap-2 mb-4">
                  <label htmlFor="profilePhoto" className="font-semibold text-lg">
                    Profile Photo
                  </label>

                  <div className="flex gap-4 items-center">
                    {/* Profile Photo Upload Square */}
                    <div className="relative w-24 h-24 border border-gray-300 border-dashed bg-neutral-100 rounded-lg flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        id="profilePhoto"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Plus size={32} color="#2E3192" />
                    </div>

                    {/* Display Uploaded Image */}
                    {formData.profilePhoto && (
                      <div className="relative">
                        <img
                          src={formData.profilePhoto}
                          alt="Uploaded Profile"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        {/* Cross mark to remove the image */}
                        <div
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 text-red-500 bg-red-200 rounded-full p-1 cursor-pointer"
                        >
                          <X size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Conditional Rendering for Login Fields */}
          {!isNewUser && (
            <div className="flex flex-col gap-5">
              <div className="flex gap-6">
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[#5C5C5C]">Please fill your login credentials to continue</p>
                <hr className="mt-4 mb-4 w-[60%] text-[#EDEDED]" />
                <div className="flex flex-col ">
                  <p className="text-gray-700 font-medium mb-2">or continue with Google</p>
                  <button className="flex items-center bg-white">
                    <img src="components/Images/google.png" alt="Google Icon" className="w-8 h-8 cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between align-bottom">
            <div className="flex align-bottom">
              <p className="text-center mt-3 text-md font-base text-[#3E3E3E]">
                {isNewUser ? "Already have an account?" : "Don't have an account?"}{" "}
                <span
                  className="text-[#2E3192] cursor-pointer font-medium"
                  onClick={() => setIsNewUser(!isNewUser)}
                >
                  {isNewUser ? "Login" : "Register"}
                </span>
              </p>
            </div>
            <div>
              <button
                onClick={handleAuth}
                className="w-[170px] bg-[#2E3192] text-white p-2 rounded-2xl cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? "Processing..." : isNewUser ? "Register" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
