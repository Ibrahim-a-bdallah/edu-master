// components/ExamTimer.tsx
"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExamTimerProps {
  endTime: string;
  onTimeUp: () => void;
}

export default function ExamTimer({ endTime, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        onTimeUp();
        return { minutes: 0, seconds: 0 };
      }

      return {
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  const isWarning = timeLeft.minutes < 5;
  const isCritical = timeLeft.minutes < 2;

  return (
    <Alert
      className={
        isCritical
          ? "bg-red-50 border-red-200"
          : isWarning
          ? "bg-amber-50 border-amber-200"
          : ""
      }
    >
      <AlertDescription className="font-mono text-lg">
        Time Left: {timeLeft.minutes.toString().padStart(2, "0")}:
        {timeLeft.seconds.toString().padStart(2, "0")}
        {isCritical && " ⚠️ Hurry up!"}
        {isWarning && !isCritical && " ⏳ Time is running out!"}
      </AlertDescription>
    </Alert>
  );
}
