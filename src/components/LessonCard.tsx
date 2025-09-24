"use client";
import { Lesson } from "@/app/types/lesson";
import { handleCheckout } from "@/lib/checkout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
interface LessonCardProps {
  lesson: Lesson;
}
const LessonCard = ({ lesson }: LessonCardProps) => {
  const [hasPaid, setHasPaid] = useState(false) 
  const isUnlocked = !lesson.isPaid || hasPaid; 
  useEffect(() => {
    const stored = localStorage.getItem("paidLessons") // Get paidLessons from localStorage
    const paidLessons = stored ? JSON.parse(stored) : []
    setHasPaid(paidLessons.includes(lesson._id)) // Check if current lesson is in paidLessons
  }, [lesson._id])
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col ">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">{lesson.title}</CardTitle>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {lesson.classLevel}
        </Badge>
      </CardHeader>
      {/* Content */}
      <CardContent className="flex flex-col gap-3">
        {/* Description */}
        <p className="text-gray-600 line-clamp-3">{lesson.description}</p>
        {/* Date */}
        <p className="text-sm text-gray-500">
          {lesson.scheduledDate
            ? new Date(lesson.scheduledDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "No schedule"}
        </p>
        {/* Price */}
        <div>
          {lesson.isPaid ? (
            <span className="text-red-500 font-medium text-lg">Price: {lesson.price} EGP</span>
          ) : (
            <span className="text-green-600 font-medium text-lg">Free Lesson</span>
          )}
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2 relative">
          {/* Video with blur if locked */}
          <div className="relative">
            <iframe
              width="100%"
              height="220"
              src={lesson.video.replace("watch?v=", "embed/")}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className={`rounded-lg w-full h-[220px] ${
                isUnlocked ? "" : "blur-md pointer-events-none"
              }`}
              allowFullScreen={isUnlocked}
            ></iframe>
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow">
                  Pay to Unlock
                </span>
              </div>
            )}
          </div>
          {/* Button */}
          {isUnlocked ? (
            <Button className="bg-green-600 hover:bg-green-700 w-full cursor-pointer">
              Watch
            </Button>
          ) : (
            <Button
              onClick={() => handleCheckout(lesson)}
              className="bg-purple-600 hover:bg-purple-700 w-full cursor-pointer"
            >
              Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default LessonCard;
