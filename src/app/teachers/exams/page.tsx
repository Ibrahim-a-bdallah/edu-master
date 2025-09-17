"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import {
  fetchExams,
  setSearchTerm,
  setActiveTab,
  selectFilteredExams,
  selectLoading,
  selectError,
  selectSearchTerm,
  selectActiveTab,
} from "@/store/teachers/exams/examSlice";
import Loading from "@/components/Loading";
export default function Page() {
  const dispatch = useAppDispatch();
  const { tokan } = useAppSelector((state) => state.authLoginSlice);
  console.log("token", tokan);
  const filteredExams = useAppSelector(selectFilteredExams);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const searchTerm = useAppSelector(selectSearchTerm);
  const activeTab = useAppSelector(selectActiveTab);

  useEffect(() => {
    if (tokan) {
      dispatch(fetchExams(tokan));
    }
  }, [dispatch, tokan]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleTabChange = (tab: "scheduled" | "history") => {
    dispatch(setActiveTab(tab));
  };

  if (loading === "pending") {
    return <Loading message="Loading Exams..." />;
  }

  // Show error state
  if (loading === "failed") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => tokan && dispatch(fetchExams(tokan))}
            className="bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full py-8 md:py-16 font-geist-sans">
      <div className="flex flex-col md:flex-row justify-between w-full px-4 md:px-8 gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Exams</h1>
        </div>
        <div>
          <button className="bg-main rounded-2xl py-2 px-4 text-white font-normal text-[16px] cursor-pointer w-full md:w-auto">
            + Add Exam
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start text-nowrap gap-4 w-full border-b border-gray-300 px-4 md:px-8">
        <div className="flex gap-4 md:gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <h2
            className={`text-lg md:text-xl cursor-pointer ${
              activeTab === "scheduled"
                ? "text-main border-b-2 border-main pb-4 md:pb-6 font-semibold"
                : "text-[#333437]"
            }`}
            onClick={() => handleTabChange("scheduled")}
          >
            Scheduled Exams
          </h2>
          <h2
            className={`text-lg md:text-xl cursor-pointer ${
              activeTab === "history"
                ? "text-main border-b-2 border-main pb-4 md:pb-6 font-semibold"
                : "text-[#333437]"
            }`}
            onClick={() => handleTabChange("history")}
          >
            History
          </h2>
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Exams"
            className="border border-gray-300 rounded-2xl py-2 px-4 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
      </div>

      <div>
        {activeTab === "scheduled" ? (
          <div className="p-4 md:p-8">
            {filteredExams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                {filteredExams.map((exam) => (
                  <div key={exam._id} className="w-full h-full">
                    <div className="border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                      <h3 className="text-lg font-semibold mb-2">
                        {exam.title}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Class level : {exam.classLevel}
                      </p>
                      <p className="text-gray-600 mb-1 flex-1">
                        Description : {exam.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-2">
                        <div className="text-[#333437] flex items-center gap-1">
                          <FaCalendar className="text-xl md:text-2xl" />
                          <h1 className="text-sm md:text-base">
                            {new Date(exam.endDate).toLocaleDateString()}
                          </h1>
                        </div>
                        <div className="text-[#333437] flex items-center gap-1">
                          <MdOutlineAccessTime className="text-xl md:text-2xl" />
                          <h1 className="text-sm md:text-base">
                            {exam.duration} mins
                          </h1>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-1 mt-2">
                        Questions : {exam.questions.length}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-600">Passing Percentage</p>
                        <p className="text-gray-600">70%</p>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full mb-4 mt-2">
                        <div
                          className="h-full bg-main rounded-full"
                          style={{ width: "70%" }}
                        ></div>
                      </div>

                      <Link
                        href={`/teachers/exams/${exam._id}`}
                        className="bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 hover:scale-95 transition-colors text-center duration-300 cursor-pointer w-full mt-auto"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <p className="text-gray-500">
                No exams found matching "{searchTerm}"
              </p>
            ) : (
              <p className="text-gray-500">No scheduled exams available.</p>
            )}
          </div>
        ) : (
          <div className="p-4 md:p-8">
            <p className="text-gray-500">No exam history available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
