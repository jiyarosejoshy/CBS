"use client";  // Required for client-side navigation
import account from "./user/account/page";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();  // Initialize router

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission
    // TODO: Add authentication logic here
    router.push("/account"); // Redirect to account page after login
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}  
        className="flex flex-col gap-4 p-6 w-1/4 border border-black bg-white rounded-xl"
      >
        <Label>Username</Label>
        <Input placeholder="meenakshy" type="text" id="username" name="username" required />
        <Label>Password</Label>
        <Input placeholder="****" type="password" id="password" name="password" required />
        <Button type="submit">Login</Button>  
      </form>
    </div>
  );
};

export default Page;
