"use client"; 
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.role === "admin") {
        router.push("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        router.push("/user/dashboard"); // Redirect to user dashboard
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 w-1/4 border border-black bg-white rounded-xl">
        <Label>Username</Label>
        <Input placeholder="username" type="text" name="username" required />
        <Label>Password</Label>
        <Input placeholder="****" type="password" name="password" required />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Page;
