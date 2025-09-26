import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  fetchScoreExam,
  selectScoreExams,
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
  const dispatch = useAppDispatch();
  const score = useAppSelector(selectScoreExams);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const token = "your_auth_token"; 
  const examId = "your_exam_id";


  const handleFetchScore = async () => {
    await dispatch(fetchScoreExam({ id: examId, token }));
  };

  return (
    <div>
      <h1>Exam Score</h1>
      {loading === "pending" && <p>Loading...</p>}
      {error as string && <p>Error: {error as string}</p>}
      <button onClick={handleFetchScore}>Fetch Score</button>
      <p>Score: {score as string}</p>
    </div>
  );
};

export default ExamScore;