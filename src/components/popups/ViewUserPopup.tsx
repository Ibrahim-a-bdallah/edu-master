"use client";
import React from "react";

interface ViewUserPopupProps {
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    classLevel?: string;
    studentId?: string;
    isVerified?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ViewUserPopup = ({ user, isOpen, onClose }: ViewUserPopupProps) => {
  if (!isOpen) return null;

  const details = [
    { label: "Full Name", value: user?.fullName },
    { label: "Email", value: user?.email },
    { label: "Phone Number", value: user?.phoneNumber },
    { label: "Student ID", value: user?._id || "N/A" },
    { label: "Class Level", value: user?.classLevel || "Not Assigned" },
    {
      label: "Verified",
      value: user?.isVerified ? "verified" : "not verified",
    },
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Student Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {details.map((detail, index) => (
            <div key={index} className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-600 mb-1">{detail.label}</p>
              <p className="text-base font-medium text-gray-900">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9C6FE4] text-white rounded-md hover:bg-[#8B5CF6]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPopup;
