// components/LessonCard.tsx
"use client";
import { Lesson } from "@/app/types/lesson";
import { handleCheckout } from "@/lib/checkout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import UniversalVideoPlayer from "./YouTubeThumbnailPlayer";
// import UniversalVideoPlayer from "./UniversalVideoPlayer";

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  const [hasPaid, setHasPaid] = useState(false);

  const isUnlocked = useMemo(
    () => !lesson.isPaid || hasPaid,
    [lesson.isPaid, hasPaid]
  );

  useEffect(() => {
    const checkPayment = () => {
      const stored = localStorage.getItem("paidLessons");
      const paidLessons = stored ? JSON.parse(stored) : [];
      setHasPaid(paidLessons.includes(lesson._id));
    };

    checkPayment();
    window.addEventListener("storage", checkPayment);
    return () => window.removeEventListener("storage", checkPayment);
  }, [lesson._id]);

  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
          {lesson.title}
        </CardTitle>
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 shrink-0"
        >
          {lesson.classLevel}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-grow">
        <p className="text-gray-600 line-clamp-3 flex-grow">
          {lesson.description}
        </p>

        <div className="text-sm text-gray-500">
          {lesson.scheduledDate
            ? new Date(lesson.scheduledDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "No schedule"}
        </div>

        <div className="font-medium">
          {lesson.isPaid ? (
            <span className="text-red-500 text-lg">
              Price: {lesson.price} EGP
            </span>
          ) : (
            <span className="text-green-600 text-lg">Free Lesson</span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {/* استخدام المكون العالمي */}
          <UniversalVideoPlayer
            videoUrl={lesson.video}
            isUnlocked={isUnlocked}
            title={lesson.title}
          />

          {isUnlocked ? (
            <Button className="bg-green-600 hover:bg-green-700 w-full transition-colors">
              🎥 Watch Lesson
            </Button>
          ) : (
            <Button
              onClick={() => handleCheckout(lesson)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full transition-all transform hover:scale-105"
            >
              💳 Pay to Unlock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
