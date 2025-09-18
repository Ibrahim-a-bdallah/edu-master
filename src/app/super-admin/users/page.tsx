"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
type user = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  studentId?: string; // mock field for UI
};
const USERS_PER_PAGE = 5;
const users = () => {
  const [usersData, setusersData] = useState<user[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(usersData.length / USERS_PER_PAGE);
  const paginatedUsers = usersData.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
  // Fetch users from the API by admin users
  const fetchusers = async () => {
    try {
      const res = await axios.get(
        "https://edu-master-delta.vercel.app/admin/all-user",
        {
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNfYWRtaW5AZ21haWwuY29tIiwiX2lkIjoiNjg1ODkxN2EwMTM2ZWFiMzA1YTMzMGYwIiwiaWF0IjoxNzU4MDE2MTE5LCJleHAiOjE3NTgxMDI1MTl9.-404b69I6CUMvMgkNzgw8h31gldHAvq0eHKXG-0u8n4",
          },
        }
      );
      const data = await res.data;

      setusersData(data.data || []);
      console.log(data.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchusers();
  }, []);
  if (loading) {
    return <p className="text-center py-8">Loading users...</p>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-left text-gray-800">
        Users List
      </h2>
      <div className="flex items-center mb-6">
        <button className="bg-gray-100 px-4 py-2 rounded-tl-lg rounded-bl-lg border border-gray-300 border-r-0 text-gray-700 font-medium">
          Details
        </button>
        <button className="bg-blue-500 px-4 py-2 rounded-tr-lg rounded-br-lg text-white font-medium">
          Result
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">ID</th>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Email</th>
              <th className="py-3 px-4 border-b text-left">Phone number</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={user?._id || idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user?._id}</td>
                <td className="py-2 px-4 border-b">{user?.fullName}</td>
                <td className="py-2 px-4 border-b">{user?.email}</td>
                <td className="py-2 px-4 border-b ">{user?.phoneNumber}</td>
                <td className="py-2 px-4 border-b ">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded m-1">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded m-1">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default users;
