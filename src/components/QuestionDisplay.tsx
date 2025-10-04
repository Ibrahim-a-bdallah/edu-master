// components/QuestionDisplay.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  _id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "essay";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface QuestionDisplayProps {
  question: Question;
  currentAnswer: string;
  onAnswerSubmit: (answer: string) => void;
  questionNumber?: number;
}

export default function QuestionDisplay({
  question,
  currentAnswer,
  onAnswerSubmit,
  questionNumber,
}: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedAnswer(currentAnswer || "");
  }, [currentAnswer, question._id]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onAnswerSubmit(value);
  };

  const handleClearAnswer = () => {
    setSelectedAnswer("");
    onAnswerSubmit("");
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Badge variant="outline" className="text-sm">
            Question {questionNumber}
          </Badge>
          <Badge variant="secondary" className="ml-2">
            {question.points} {question.points === 1 ? "point" : "points"}
          </Badge>
          {question.type === "multiple-choice" && (
            <Badge variant="outline" className="ml-2">
              Multiple Choice
            </Badge>
          )}
        </div>

        {currentAnswer && (
          <Button variant="outline" size="sm" onClick={handleClearAnswer}>
            Clear Answer
          </Button>
        )}
      </div>

      {/* Question Text */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.text}
          </p>
        </CardContent>
      </Card>

      {/* Answer Options */}
      {question.type === "multiple-choice" && question.options && (
        <Card>
          <CardContent className="pt-6">
            <RadioGroup
              value={selectedAnswer}
              onValueChange={handleAnswerChange}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      selectedAnswer === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${index}`}
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 text-base font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* True/False Question Type */}
      {question.type === "true-false" && (
        <Card>
          <CardContent className="pt-6">
            <RadioGroup
              value={selectedAnswer}
              onValueChange={handleAnswerChange}
            >
              <div className="grid grid-cols-2 gap-4">
                {["True", "False"].map((option) => (
                  <div
                    key={option}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                      selectedAnswer === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`tf-${option}`}
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor={`tf-${option}`}
                      className="flex-1 text-base font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Essay Question Type */}
      {question.type === "essay" && (
        <Card>
          <CardContent className="pt-6">
            <Alert className="mb-4">
              <AlertDescription>
                Please type your answer in the text area below. There is no word
                limit.
              </AlertDescription>
            </Alert>
            <textarea
              value={selectedAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </CardContent>
        </Card>
      )}

      {/* Answer Status */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{selectedAnswer ? "✓ Answer saved" : "⏳ Not answered yet"}</span>
        <span>
          Question {questionNumber} of {/* Will be passed from parent */}
        </span>
      </div>
    </div>
  );
}
