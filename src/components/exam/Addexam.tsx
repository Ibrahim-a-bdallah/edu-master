"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import {
  addExam,
  updateExam,
  selectCurrentExam,
} from "@/store/teachers/exams/examSlice";
import { motion } from "framer-motion";
import { FaCalendar, FaArrowLeft, FaArrowRight, FaTimes, FaCheck } from "react-icons/fa";
import { MdOutlineAccessTime, MdDescription } from "react-icons/md";
import { Exam } from "@/app/types/exams";

interface ExamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  mode: "add" | "update";
}

const Addexam: React.FC<ExamDrawerProps> = ({
  isOpen,
  onClose,
  token,
  mode,
}) => {
  const dispatch = useAppDispatch();
  const currentExam = useAppSelector(selectCurrentExam) as Exam | null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 0,
    classLevel: "",
    isPublished: false,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (mode === "update" && currentExam) {
      setFormData({
        title: currentExam.title,
        description: currentExam.description,
        duration: currentExam.duration,
        classLevel: currentExam.classLevel,
        isPublished: currentExam.isPublished,
        startDate: currentExam.startDate
          ? new Date(currentExam.startDate).toISOString().split("T")[0]
          : "",
        endDate: currentExam.endDate
          ? new Date(currentExam.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        title: "",
        description: "",
        duration: 0,
        classLevel: "",
        isPublished: false,
        startDate: "",
        endDate: "",
      });
    }
    setStep(1);
  }, [mode, currentExam, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (mode === "add") {
      await dispatch(
        addExam({
          examData: {
            ...formData,
            startDate: formData.startDate
              ? new Date(formData.startDate)
              : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          },
          token,
        })
      );
    } else if (mode === "update" && currentExam) {
      await dispatch(
        updateExam({
          id: currentExam._id,
          examData: {
            ...formData,
            startDate: formData.startDate
              ? new Date(formData.startDate)
              : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          },
          token,
        })
      );
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative ml-auto w-full md:w-1/2 h-screen bg-white shadow-xl overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-semibold">
              {mode === "add" ? "Add New Exam" : "Edit Exam"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl p-1 rounded-full hover:bg-gray-100"
            >
              <FaTimes />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 pt-6">
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex flex-col items-center ${
                    step >= stepNum ? "text-main" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold ${
                      step >= stepNum ? "bg-main text-white" : "bg-gray-200"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {stepNum === 1 && "Basic Info"}
                    {stepNum === 2 && "Details"}
                    {stepNum === 3 && "Schedule"}
                    {stepNum === 4 && "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter exam title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter exam description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Exam Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="duration"
                      placeholder="Enter duration in minutes"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                      required
                    />
                    <MdOutlineAccessTime className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Level
                  </label>
                  <input
                    type="text"
                    name="classLevel"
                    placeholder="Enter class level"
                    value={formData.classLevel}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Schedule & Publish */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="h-5 w-5 text-main focus:ring-main border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-3 block text-sm text-gray-900">
                    Publish exam immediately
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                        required
                      />
                      <FaCalendar className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-main"
                        required
                      />
                      <FaCalendar className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-main">Exam Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <MdDescription className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Title</p>
                        <p className="font-medium">{formData.title || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <MdDescription className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="font-medium">{formData.description || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <MdOutlineAccessTime className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="font-medium">{formData.duration} minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <FaCheck className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Class Level</p>
                        <p className="font-medium">{formData.classLevel || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <FaCalendar className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Range</p>
                        <p className="font-medium">
                          {formData.startDate || "Not set"} to {formData.endDate || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-main/10 p-2 rounded-full mr-3">
                        <FaCheck className="text-main text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="font-medium">
                          {formData.isPublished ? (
                            <span className="text-green-600">Published</span>
                          ) : (
                            <span className="text-gray-600">Draft</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Please review all details carefully before {mode === "add" ? "creating" : "updating"} the exam.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                disabled={step === 1}
                className={`flex items-center px-5 py-2.5 rounded-lg ${
                  step === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-main hover:bg-gray-100"
                }`}
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                  className="flex items-center bg-main text-white px-5 py-2.5 rounded-lg hover:bg-main/90"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  {mode === "add" ? "Create Exam" : "Update Exam"}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Addexam;