"use client";
import { Lesson } from "@/app/types/lesson";
import { handleCheckout } from "@/lib/checkout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  // استخدام useMemo لتجنب إعادة حساب paidLessons في كل render
  const hasPaid = useMemo(() => {
    const stored = localStorage.getItem("paidLessons");
    const paidLessons = stored ? JSON.parse(stored) : [];
    return paidLessons.includes(lesson._id);
  }, [lesson._id]);

  const isUnlocked = !lesson.isPaid || hasPaid;

  // تحسين معالجة التاريخ
  const formattedDate = useMemo(() => {
    return lesson.scheduledDate
      ? new Date(lesson.scheduledDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "No schedule";
  }, [lesson.scheduledDate]);

  // تحسين معالجة الفيديو
  const videoSrc = useMemo(() => {
    return lesson.video.replace("watch?v=", "embed/");
  }, [lesson.video]);

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {lesson.title}
        </CardTitle>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {lesson.classLevel}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="text-gray-600 line-clamp-3">{lesson.description}</p>
        <p className="text-sm text-gray-500">{formattedDate}</p>

        <div>
          {lesson.isPaid ? (
            <span className="text-red-500 font-medium text-lg">
              Price: {lesson.price} EGP
            </span>
          ) : (
            <span className="text-green-600 font-medium text-lg">
              Free Lesson
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2 relative">
          <div className="relative">
            <iframe
              width="100%"
              height="220"
              src={videoSrc}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className={`rounded-lg w-full h-[220px] ${
                isUnlocked ? "" : "blur-md pointer-events-none"
              }`}
              allowFullScreen={isUnlocked}
              loading="lazy" // إضافة lazy loading
            ></iframe>
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow">
                  Pay to Unlock
                </span>
              </div>
            )}
          </div>

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
