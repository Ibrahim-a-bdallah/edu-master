// components/questions/QuestionForm.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/app/hooks/hooks";
import {
  addQuestion,
  updateQuestion,
  fetchQuestions,
} from "@/store/teachers/questions/questionSlice";
import { Exam } from "@/app/types/exams";
import { Question } from "@/app/types/questions";

interface QuestionFormProps {
  isOpen: boolean;
  token: string;
  onClose: () => void;
  mode: "add" | "edit";
  question?: Question;
  exams?: Exam[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  isOpen,
  token,
  onClose,
  mode,
  question,
  exams = [],
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    text: "",
    type: "multiple-choice" as
      | "multiple-choice"
      | "true-false"
      | "short-answer",
    options: ["", "", "", ""],
    correctAnswer: "",
    exam: "",
    points: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && question) {
      setFormData({
        text: question.text,
        type: question.type,
        options: question.options || ["", "", "", ""],
        correctAnswer: question.correctAnswer,
        exam: question.exam,
        points: question.points,
      });
    } else {
      setFormData({
        text: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        exam: "",
        points: 1,
      });
    }
  }, [mode, question, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) newErrors.text = "Question text is required";
    if (!formData.exam) newErrors.exam = "Please select an exam";
    if (formData.points < 1) newErrors.points = "Points must be at least 1";

    if (formData.type === "multiple-choice") {
      const filledOptions = formData.options.filter((opt) => opt.trim() !== "");
      if (filledOptions.length < 2)
        newErrors.options = "At least 2 options are required";
      if (!formData.correctAnswer)
        newErrors.correctAnswer = "Please select a correct answer";
    } else if (formData.type === "true-false") {
      if (!formData.correctAnswer)
        newErrors.correctAnswer = "Please select true or false";
    } else if (formData.type === "short-answer") {
      if (!formData.correctAnswer.trim())
        newErrors.correctAnswer = "Correct answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const questionData = {
        text: formData.text,
        type: formData.type,
        options:
          formData.type === "multiple-choice"
            ? formData.options.filter((opt) => opt.trim() !== "")
            : undefined,
        correctAnswer: formData.correctAnswer,
        exam: formData.exam,
        points: formData.points,
      };

      if (mode === "add") {
        await dispatch(addQuestion({ questionData, token })).unwrap();
      } else if (mode === "edit" && question) {
        await dispatch(
          updateQuestion({ id: question._id, questionData, token })
        ).unwrap();
      }

      dispatch(fetchQuestions(token));
      onClose();
    } catch (error) {
      console.error("Failed to save question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  if (!isOpen) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "add" ? "Add New Question" : "Edit Question"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam *
          </label>
          <select
            value={formData.exam}
            onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
          >
            <option value="">Select an exam</option>
            {exams.map((exam) => (
                
              <option key={exam._id} value={exam._id}>
               
                {exam.title}
              </option>
            ))}
          </select>
          {errors.exam && (
            <p className="text-red-500 text-sm mt-1">{errors.exam}</p>
          )}
        </div>

        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as
                  | "multiple-choice"
                  | "true-false"
                  | "short-answer",
                correctAnswer: "",
                options:
                  e.target.value === "multiple-choice" ? ["", "", "", ""] : [],
              })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
          >
            <option value="multiple-choice">multiple-choice</option>
            <option value="true-false">True-False</option>
            <option value="short-answer">Short Answer</option>
          </select>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
            placeholder="Enter your question here..."
          />
          {errors.text && (
            <p className="text-red-500 text-sm mt-1">{errors.text}</p>
          )}
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points *
          </label>
          <input
            type="number"
            min="1"
            value={formData.points}
            onChange={(e) =>
              setFormData({ ...formData, points: parseInt(e.target.value) })
            }
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
          />
          {errors.points && (
            <p className="text-red-500 text-sm mt-1">{errors.points}</p>
          )}
        </div>

        {/* Options for multiple-choice */}
        {formData.type === "multiple-choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options *
            </label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === option}
                  onChange={() =>
                    setFormData({ ...formData, correctAnswer: option })
                  }
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {errors.options && (
              <p className="text-red-500 text-sm mt-1">{errors.options}</p>
            )}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-main hover:text-main/80"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer *
          </label>

          {formData.type === "multiple-choice" ? (
            <select
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">Select correct answer</option>
              {formData.options
                .filter((opt) => opt.trim() !== "")
                .map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          ) : formData.type === "true-false" ? (
            <select
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">Select true or false</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            <input
              type="text"
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter the correct answer..."
            />
          )}

          {errors.correctAnswer && (
            <p className="text-red-500 text-sm mt-1">{errors.correctAnswer}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "add"
              ? "Add Question"
              : "Update Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
