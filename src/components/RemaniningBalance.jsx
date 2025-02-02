import React, { useState, useEffect } from "react";
import { db ,auth} from "../firebase"; // assuming you have firebase initialized in this file
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { TrendingDown } from "lucide-react"; // Assuming you're using react-icons for the icon
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

const data = [
    { name: "Jan", uv: 1000 }, // Keep initial value
    { name: "Feb", uv: 1300 }, // Smooth transition between Jan and Feb
    { name: "Mar", uv: 1250 }, // Smooth transition between Feb and Mar
    { name: "Apr", uv: 1400 }, // Smooth transition between Mar and Apr
    { name: "May", uv: 1950 }, // Smooth transition between Apr and May
    { name: "Jun", uv: 1450 }, // Smooth transition between May and Jun
    { name: "Jul", uv: 1300 }, // Smooth transition between Jun and Jul
  
    // { name: 'Aug', uv: 1490 },
    // { name: 'Sep', uv: 1490 },
    // { name: 'Oct', uv: 1490 },
    // { name: 'Nov', uv: 1490 },
    // { name: 'Dec', uv: 1490 },
  ];

const RemainingBalance = () => {
    const [userId, setUserId] = useState(null);
    const [salary, setSalary] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
  
    // Get the logged-in user's ID when component mounts
    useEffect(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserId(currentUser.uid);
      }
    }, []);
  
    // Fetch Salary & Expenses ONLY after userId is set
    useEffect(() => {
      if (userId) {
        fetchSalaryAndExpenses();
      }
    }, [userId]); // Run when `userId` updates
  
    const fetchSalaryAndExpenses = async () => {
      try {
        if (!userId) {
          console.error("Error: userId is undefined or invalid");
          return;
        }
  
        // Fetch the user's salary from the users collection
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const salaryValue = parseFloat(userDoc.data().monthlySalary);
          if (!isNaN(salaryValue)) {
            setSalary(salaryValue);
          } else {
            console.error("Error: Invalid salary format");
          }
        } else {
          console.error("User document not found");
          return;
        }
  
        // Fetch expenses for the current month
        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        const expensesQuery = query(
          collection(db, "expenses"),
          where("userId", "==", userId),
          where("date", ">=", `${currentMonth}`) // Filtering by current month
        );
  
        const expenseDocs = await getDocs(expensesQuery);
  
        let total = 0;
        expenseDocs.forEach((doc) => {
          const amount = parseFloat(doc.data().amount);
          if (!isNaN(amount)) {
            total += amount;
          } else {
            console.error("Invalid expense amount:", doc.data().amount);
          }
        });
  
        setTotalExpenses(total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
  return (
    <div className="w-[45%] bg-[#212121] rounded-lg flex flex-col justify-between pt-4">
      <div>
        <div className="text-center">
          <p className="text-xl font-medium text-[#C1C4C8] font-wide mb-8">
            Remaining Balance
          </p>
          <div className="text-4xl text-[#FFFFFF] font-semibold mb-2 flex-grow font-wide">
            <span className="text-[#8B8B8B] text-2xl mr-1">$</span>
            {salary-totalExpenses.toFixed(2)}
            <span className="text-2xl text-[#8B8B8B]">.00</span>
          </div>
          {/* Center the icon and text */}
          <div className="flex justify-center items-center text-red-400 text-sm mb-4">
            <TrendingDown className="w-4 h-4 mr-2" /> {/* Icon */}
            <span>2.5% v last month</span> {/* Text */}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={data}>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8C7BF3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RemainingBalance;
