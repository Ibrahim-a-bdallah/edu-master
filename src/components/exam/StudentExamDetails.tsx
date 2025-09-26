"use client";
import { MdOutlineAccessTime } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { FaCalendar } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { Exam } from "@/app/types/exams";
import {selectRemainingTime} from "@/store/studentsExam/studentsExamSlice";
import React, { useEffect} from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {getRemainingTime} from "@/store/studentsExam/studentsExamSlice";


type StudentExamDetailsProps = {
  exam: Exam;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSubmit : (studentExamData:any) => Promise<void>; // Define the onSubmit prop type
};

export default function StudentExamDetails({
  exam,
  onClose,
  onDelete,
  onSubmit,
}: StudentExamDetailsProps) {
  const totalMarks = exam.questions.reduce((total, question) => {
    return total + (question as any).points;
  }, 0);
  const remainingTime = useAppSelector(selectRemainingTime);
  const dispatch = useAppDispatch();
  const token = "your_auth_token"; 
  const examId = exam._id;  
useEffect(() => {
    dispatch(getRemainingTime({ id: examId, token }));
  }, [dispatch, examId, token]);
  return (
    <div className="flex flex-col gap-4 w-full h-full py-8 md:py-16 font-geist-sans">
      <div className="flex justify-between px-4 md:px-8">
        <button
          onClick={onClose}
          className="text-3xl text-main hover:text-main/70 hover:scale-95 transition-all duration-200 cursor-pointer"
        >
          <RxCrossCircled />
        </button>
        <button
          onClick={() => onDelete(exam._id)}
          className="flex gap-4 cursor-pointer justify-center items-center border border-red-700 p-2 rounded-md hover:scale-95 text-red-700 transition-all duration-200"
        >
          <ImBin className="text-2xl" /> <h1>Delete</h1>
        </button>
      </div>

      <div className="flex flex-col justify-between px-4 md:px-8">
        <p>Remaining Time: {remainingTime as string}</p>
        <h1 className="text-2xl font-semibold">{exam.title}</h1>
        <p className="text-gray-600 mb-1">Class Level: {exam.classLevel}</p>
        <p className="text-gray-600 mb-1 flex-1">
          Description: {exam.description}
        </p>

        <p className="text-gray-600 mb-1 mt-2">
          Questions: {exam.questions.length}
        </p>
        <p className="text-gray-600 mb-1">Total Marks: {totalMarks}</p>

        <div className="flex items-center justify-between mt-2 max-w-1/3">
          <p className="text-gray-600">Passing Percentage</p>
          <p className="text-main">70%</p>
        </div>

        <div className="mt-3">
          <h1 className="text-gray-600">Exam Schedule</h1>
          <div className="flex flex-col sm:flex-row gap-10 mt-2">
            <div className="text-[#333437] flex items-center gap-1 bg-[#333437]/20 px-4 py-2 rounded-lg">
              <FaCalendar className="text-xl md:text-2xl" />
              <h1 className="text-sm md:text-base">
                {new Date(exam.endDate).toLocaleDateString()}
              </h1>
            </div>
            <div className="text-[#333437] flex items-center gap-1 bg-[#333437]/20 px-4 py-2 rounded-lg">
              <MdOutlineAccessTime className="text-xl md:text-2xl" />
              <h1 className="text-sm md:text-base">{exam.duration} mins</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between items-start px-4 md:px-8 w-full mt-4">
        <button
          onClick={onSubmit} 
          className="border border-green-500 text-green-500 py-2 px-4 rounded-md hover:bg-green-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}