"use client";

import React, { useEffect, useState } from "react";
import { FaCalendar } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { motion } from "framer-motion";
import {
  fetchExams,
  setActiveTab,
  deleteExam,
  setCurrentExam,
} from "@/store/teachers/exams/examSlice";
import { submitExams, startExam } from "@/store/studentsExam/studentsExamSlice";
import StudentExamDetails from "@/components/exam/StudentExamDetails";
import { Exam } from "@/app/types/exams";
import StudentExamCard from "@/components/exam/StudentExamCart";
import { redirect } from "next/navigation";

export default function Page() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const { loading, error, activeTab, filteredExams } = useAppSelector(
    (state) => state.examSlice
  );

  const selectedExam = useAppSelector(
    (state) => state.examSlice.currentExam
  ) as Exam | null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"score">("score");

  useEffect(() => {
    if (typeof token === "string" && token.trim()) {
      dispatch(fetchExams(token));
    }
  }, [dispatch, token]);

  const handleTabChange = (tab: "scheduled" | "history") => {
    dispatch(setActiveTab(tab));
  };

  const handleDeleteExam = (id: string) => {
    dispatch(deleteExam({ id, token: token as string }));
    dispatch(setCurrentExam(null));
    setIsModalOpen(false);
  };

  const handleSubmitExam = async (studentExamData: any) => {
    await dispatch(submitExams({ studentExamData, token: token as string }));
  };

  const handleStartExam = async (id: string) => {
    await dispatch(startExam({ id, token: token as string }));
    redirect(`http://localhost:3000/students/exams/${id}/start`);
  };

  const renderModalContent = () => {
    if (modalMode === "score") {
      return (
        <div>ScoreExam</div>
        // <ScoreExam
        //   isOpen={isModalOpen}
        //   token={token as string}
        //   onClose={() => setIsModalOpen(false)}
        //   mode="score"
        // />
      );
    }

    if (modalMode === "details" && selectedExam) {
      return (
        <StudentExamDetails
          exam={selectedExam}
          onClose={() => {
            dispatch(setCurrentExam(null));
            setIsModalOpen(false);
          }}
          onSubmit={handleSubmitExam}
          onDelete={handleDeleteExam}
        />
      );
    }
    return null;
  };

  if (loading === "failed") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{String(error)}</p>
          <button
            onClick={() =>
              typeof token === "string" &&
              token.trim() &&
              dispatch(fetchExams(token))
            }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between w-full px-4 md:px-8 gap-4">
        <h1 className="font-semibold text-2xl">Exams</h1>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full border-b border-gray-300 px-4 md:px-8">
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
      </div>

      {/* Content */}
      <div>
        {activeTab === "scheduled" ? (
          <div className="p-4 md:p-8">
            {filteredExams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                {filteredExams.map((exam: Exam) => (
                  <StudentExamCard
                    key={exam._id}
                    exam={exam}
                    onStart={() => handleStartExam(exam._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <FaCalendar className="text-4xl mb-2" />
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 md:p-8">
            <div className="flex flex-col items-center justify-center text-gray-500 py-8">
              <FaCalendar className="text-4xl mb-2" />
              <p>No exam history available.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Drawer */}
      {isModalOpen && (
        <motion.div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              dispatch(setCurrentExam(null));
              setIsModalOpen(false);
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5 }}
            className="relative ml-auto w-full md:w-1/2 h-screen bg-white shadow-xl overflow-y-auto"
          >
            {renderModalContent()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
