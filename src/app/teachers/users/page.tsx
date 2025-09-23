"use client";
import Loading from "@/components/Loading";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import ViewUserPopup from "@/components/popups/ViewUserPopup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
type student = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  studentId?: string;
  classLevel?: string;
};
const studentS_PER_PAGE = 5;
const Students = () => {
  const [studentsData, setstudentsData] = useState<student[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<student | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // Get token from Redux store
  const token = useSelector((state: RootState) => state.auth.tokan);

  const totalPages = Math.ceil(studentsData.length / studentS_PER_PAGE);
  const paginatedstudents = studentsData.slice(
    (currentPage - 1) * studentS_PER_PAGE,
    currentPage * studentS_PER_PAGE
  );
  // Fetch students from the API by admin students
  const fetchstudents = async () => {
    try {
      const res = await api.get("/admin/all-user", {
        headers: {
          token: token,
        },
      });
      const data = await res.data;

      setstudentsData(data.data || []);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchstudents();
  }, []);
  if (loading) {
    return Loading({ message: "Loading students..." });
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-left text-gray-800">
          Students Overview
        </h2>

        {/* Class Level Distribution Chart */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">ID</th>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Class Level</th>
              <th className="py-3 px-4 border-b text-left">Email</th>
              <th className="py-3 px-4 border-b text-left">Phone number</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedstudents.map((student, idx) => (
              <tr key={student?._id || idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{student?._id}</td>
                <td className="py-2 px-4 border-b">{student?.fullName}</td>
                <td className="py-2 px-4 border-b">{student?.classLevel}</td>
                <td className="py-2 px-4 border-b">{student?.email}</td>
                <td className="py-2 px-4 border-b ">{student?.phoneNumber}</td>
                <td className="py-2 px-4 border-b ">
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditPopupOpen(true);
                    }}
                    className=" bg-[#9C6FE4] hover:bg-[#7A4BC0] text-white px-4 py-2 rounded m-1"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Popup */}
      {selectedStudent && (
        <ViewUserPopup
          user={selectedStudent}
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
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

export default Students;
