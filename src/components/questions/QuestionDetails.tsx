// components/questions/QuestionDetails.tsx
import React from 'react';
import { Question } from '@/app/types/questions';
import { Exam } from '@/app/types/exams';

interface QuestionDetailsProps {
  question: Question;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
  exams?: Exam[];
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  question,
  onClose,
  onDelete,
  onEdit,
  exams = []
}) => {
  const exam = exams.find(e => e._id === question.exam);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Question Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Exam</h3>
          <p className="text-lg">{exam?.title || question.exam}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Question Type</h3>
          <p className="text-lg capitalize">{question.type}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Question Text</h3>
          <p className="text-lg">{question.text}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Points</h3>
          <p className="text-lg">{question.points}</p>
        </div>
        
        {question.options && question.options.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Options</h3>
            <ul className="list-disc list-inside">
              {question.options.map((option, index) => (
                <li key={index} className={option === question.correctAnswer ? 'text-green-600 font-semibold' : ''}>
                  {option} {option === question.correctAnswer && '(Correct)'}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {(!question.options || question.options.length === 0) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Correct Answer</h3>
            <p className="text-lg font-semibold text-green-600">{question.correctAnswer}</p>
          </div>
        )}
        
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() => onDelete(question._id)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;