import { useEffect, useState } from "react";
import { auth } from "../firebase"; // Adjust the import based on your structure
import { onAuthStateChanged } from "firebase/auth";

const CCname = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="absolute top-24 left-24 text-white">
      <p className="font-semibold mb-3 text-2xl font-wide">
        {user ? user.displayName || "User" : "Guest"}
      </p>
      <p className="text-xs font-wider ">
        {user ? user.email || "No Email" : "Not Logged In"}
      </p>
    </div>
  );
};

export default CCname;
