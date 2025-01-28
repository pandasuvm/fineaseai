import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./flows/common/Register";
import JobSeekerQuestions from "./flows/job-seeker/Form/Questions";
import JobSeekerHome from "./flows/job-seeker/Home/Home";
import JobGiverDashboard from "./flows/job-provider/Dashboard/Dashboard";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job-seeker/questions" element={<JobSeekerQuestions />} />
        <Route path="/job-seeker/home" element={<JobSeekerHome />} />
        <Route path="/job-giver/dashboard" element={<JobGiverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);