// app/teachers/questions/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaEye, FaCalendar } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { motion } from "framer-motion";
import {
  fetchQuestions,
  setSearchTerm,
  setFilterByExam,
  selectFilteredQuestions,
  selectLoading,
  selectError,
  selectSearchTerm,
  selectFilterByExam,
  deleteQuestion,
  selectCurrentQuestion,
  setCurrentQuestion,
} from "@/store/teachers/questions/questionSlice";
import {
  fetchExams,
  selectFilteredExams,
} from "@/store/teachers/exams/examSlice";
import Loading from "@/components/Loading";
import QuestionForm from "@/components/questions/QuestionForm";
import QuestionDetails from "@/components/questions/QuestionDetails";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Question } from "@/app/types/questions";
import { Exam } from "@/app/types/exams";

export default function QuestionsPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const filteredQuestions = useAppSelector(selectFilteredQuestions) as Question[];
  const exams = useAppSelector(selectFilteredExams) as Exam[];
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const searchTerm = useAppSelector(selectSearchTerm);
  const filterByExam = useAppSelector(selectFilterByExam);
  const currentQuestion = useAppSelector(selectCurrentQuestion) as Question | null;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "details">("add");
  const [showFilters, setShowFilters] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (typeof token === "string" && token.trim()) {
      dispatch(fetchQuestions(token));
      dispatch(fetchExams(token));
    }
  }, [dispatch, token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleExamFilterChange = (examId: string | null) => {
    dispatch(setFilterByExam(examId));
  };

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = () => {
    if (questionToDelete) {
      dispatch(deleteQuestion({ id: questionToDelete, token: token as string }));
      setShowConfirmModal(false);
      setQuestionToDelete(null);
      
      if (isModalOpen && modalMode === "details") {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setQuestionToDelete(null);
  };

  const renderModalContent = () => {
    if (modalMode === "add") {
      return (
        <QuestionForm
          isOpen={isModalOpen}
          token={token as string}
          onClose={() => setIsModalOpen(false)}
          mode="add"
          exams={exams}
        />
      );
    }
    if (modalMode === "edit" && currentQuestion) {
      return (
        <QuestionForm
          isOpen={isModalOpen}
          token={token as string}
          onClose={() => setIsModalOpen(false)}
          mode="edit"
          question={currentQuestion}
          exams={exams}
        />
      );
    }
    if (modalMode === "details" && currentQuestion) {
      return (
        <QuestionDetails
          question={currentQuestion}
          exams={exams}
          onClose={() => {
            dispatch(setCurrentQuestion(null));
            setIsModalOpen(false);
          }}
          onDelete={() => handleDeleteClick(currentQuestion._id)}
          onEdit={() => {
            setModalMode("edit");
          }}
        />
      );
    }
    return null;
  };

  if (loading === "pending") {
    return <Loading message="Loading Questions..." />;
  }

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
              dispatch(fetchQuestions(token))
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
        <h1 className="font-semibold text-2xl">Questions</h1>
        <button
          onClick={() => {
            dispatch(setCurrentQuestion(null));
            setIsModalOpen(true);
            setModalMode("add");
          }}
          className="bg-main rounded-2xl py-2 px-4 text-white font-normal text-[16px] cursor-pointer w-full md:w-auto"
        >
          <FaPlus className="inline mr-2" /> Add Question
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full px-4 md:px-8">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={typeof searchTerm === "string" ? searchTerm : ""}
            onChange={handleSearchChange}
            placeholder="Search questions..."
            className="border border-gray-300 rounded-2xl py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 rounded-2xl py-2 px-4 text-gray-700 hover:bg-gray-200"
          >
            <FaFilter /> Filter
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 p-4">
              <h3 className="font-semibold mb-2">Filter by Exam</h3>
              <select
                value={typeof filterByExam === "string" ? filterByExam : ""}
                onChange={(e) => handleExamFilterChange(e.target.value || null)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">All Exams</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="p-4 md:p-8">
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((question) => {
              const exam = exams.find(e => e._id === question.exam);
              return (
                <div key={question._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{question.text}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {question.type}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {question.points} points
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Exam: {exam?.title || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch(setCurrentQuestion(question));
                          setModalMode("details");
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {
                          dispatch(setCurrentQuestion(question));
                          setModalMode("edit");
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(question._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 py-8">
            <FaCalendar className="text-4xl mb-2" />
            <p>
              {searchTerm || filterByExam
                ? "No questions found matching your criteria"
                : "No questions available. Add your first question!"}
            </p>
          </div>
        )}
      </div>

      {/* Question Modal Drawer */}
      {isModalOpen && (
        <motion.div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              dispatch(setCurrentQuestion(null));
              setIsModalOpen(false);
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5 }}
            className="relative ml-auto w-full md:w-1/2 lg:w-2/5 h-screen bg-white shadow-xl overflow-y-auto"
          >
            {renderModalContent()}
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />
    </div>
  );
}