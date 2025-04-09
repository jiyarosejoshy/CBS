"use client";
import React, { useState ,useEffect} from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/Navbar-admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink } from "lucide-react";
import axios from 'axios';
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/2e656086-446e-4eac-9423-c7c70e8725e8"
        );
        setUser({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
  <NavBar />
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <Card className="bg-blue-50 border border-blue-200">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-blue-800">
          Welcome back, {user?.name || "Valued Member"}!
        </CardTitle>
        <h1 className="text-2xl font-bold text-red-900 py-2">Administration</h1>
        <CardDescription className="text-blue-800">
          Empowering communities through shared financial prosperity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-blue-700">
          Welcome to the heart of our cooperative banking system. Here you'll manage the tools that 
          strengthen our community's financial foundation and ensure every member thrives.
        </p>
      </CardContent>
    </Card>

        {/* Cooperative Principles Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Voluntary & Open</CardTitle>
              <CardDescription className="text-blue-600">
                Membership available to all who need our services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Democratic Control</CardTitle>
              <CardDescription className="text-green-600">
                One member, one vote - true financial democracy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Member Participation</CardTitle>
              <CardDescription className="text-purple-600">
                Members actively shape their financial future
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-teal-200 bg-teal-50">
            <CardHeader>
              <CardTitle className="text-teal-800">Autonomy & Independence</CardTitle>
              <CardDescription className="text-teal-600">
                Self-help organization controlled by our members
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cooperative Management */}
          <div className="space-y-6 lg:col-span-2">
            {/* Cooperative Values Card */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-yellow-800">
                  Our Cooperative Difference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      <TableHead>Traditional Bank</TableHead>
                      <TableHead>Our Cooperative</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ownership</TableCell>
                      <TableCell>Shareholders</TableCell>
                      <TableCell className="font-semibold text-yellow-800">Our Members</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Profits</TableCell>
                      <TableCell>To shareholders</TableCell>
                      <TableCell className="font-semibold text-yellow-800">Returned to members</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Decision Making</TableCell>
                      <TableCell>Board of directors</TableCell>
                      <TableCell className="font-semibold text-yellow-800">Democratic vote</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Focus</TableCell>
                      <TableCell>Profit maximization</TableCell>
                      <TableCell className="font-semibold text-yellow-800">Member needs</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          
          </div>
        </div>
      </div>
    
  );
};

export default AdminDashboard;
