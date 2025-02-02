import { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Import Firestore
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const CCname = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || "User"); // Use Firestore name
        } else {
          setUserName(currentUser.displayName || "User"); // Use Google name if available
        }
      } else {
        setUser(null);
        setUserName("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="absolute top-24 left-24 text-white">
      <p className="font-semibold mb-3 text-2xl font-wide">{userName}</p>
      <p className="text-xs font-wider">
        {user ? user.email || "No Email" : "Not Logged In"}
      </p>
    </div>
  );
};

export default CCname;
