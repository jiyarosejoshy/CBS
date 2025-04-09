"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
            const res = await fetch("http://localhost:5000/api/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
      

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        switch (data.role) {
          case "badmin":
            router.push("/admin/dashboard");
            break;
          case "sadmin":
            router.push("/super-admin/dashboard");
            break;
          case "teller":
            router.push("/teller/dashboard");
            break;
          case "user":
            router.push("/user/dashboard");
            break;
          default:
            setMessage("Unknown role");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6 tracking-tight">
          Bank ERP Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center border rounded-xl px-3 py-2 bg-blue-50">
            <Mail className="text-blue-500 mr-2" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded-xl px-3 py-2 bg-blue-50">
            <Lock className="text-blue-500 mr-2" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 shadow"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          Cooperative Bank ERP System
        </p>
      </div>
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Page() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState(""); // actual password now
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Store user info in localStorage if needed
//         localStorage.setItem("user", JSON.stringify(data));

//         // Redirect based on role
//         switch (data.role) {
//           case "badmin":
//             router.push("/admin/dashboard");
//             break;
//           case "sadmin":
//             router.push("/super-admin/dashboard");
//             break;
//           case "teller":
//             router.push("/teller/dashboard");
//             break;
//           case "user":
//             router.push("/user/dashboard");
//             break;
//           default:
//             setMessage("Unknown role");
//         }
//       } else {
//         setMessage(data.message || "Login failed");
//       }
//     } catch (err) {
//       setMessage("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Login</h1>
//       <form onSubmit={handleLogin} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//       {message && <p className="mt-4 text-center text-red-500">{message}</p>}
//     </div>
//   );
// }
