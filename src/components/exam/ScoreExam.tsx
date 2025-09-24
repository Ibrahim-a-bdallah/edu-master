import React, { useEffect,useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  fetchScoreExam,
  getRemainingTime,
  selectScoreExams,
  selectRemainingTime,
  selectLoading,
  selectError, 
} from "@/store/studentsExam/studentsExamSlice";

interface ExamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  mode: "score";
}




const ExamScore:React.FC<ExamDrawerProps>  = () => {
   const isOpen = true;
   const onClose = () => {};  
   const mode = "score";
  const dispatch = useAppDispatch();
  const score = useAppSelector(selectScoreExams);
  const remainingTime = useAppSelector(selectRemainingTime);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const token = "your_auth_token"; // replace with your token logic
  const examId = "your_exam_id"; // replace with your exam ID logic

  useEffect(() => {
    // Fetch remaining time when the component mounts
    dispatch(getRemainingTime({ id: examId, token }));
  }, [dispatch, examId, token]);

//   const handleStartExam = async () => {
//     const examData = { };
//     await dispatch(startExam({ examData, token }));
//   };

//   const handleSubmitExam = async (studentExamData) => {
//     await dispatch(submitExams({ studentExamData, token }));
//   };

  const handleFetchScore = async () => {
    await dispatch(fetchScoreExam({ id: examId, token }));
  };

  return (
    <div>
      <h1>Exam Score</h1>
      {loading === "pending" && <p>Loading...</p>}
      {error as string && <p>Error: {error as string}</p>}
      {/* <button onClick={handleStartExam}>Start Exam</button>
      <button onClick={handleFetchScore}>Fetch Score</button>
      <button
        onClick={() => handleSubmitExam({  })}
      >
        Submit Exam
      </button> */}
      <p>Remaining Time: {remainingTime as string}</p>
      <p>Score: {score as string}</p>
    </div>
  );
};

export default ExamScore;