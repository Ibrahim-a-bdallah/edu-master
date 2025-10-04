"use client";

import { useEffect } from "react";

interface ExamProtectionProps {
  onViolation: () => void;
}

export default function ExamProtection({ onViolation }: ExamProtectionProps) {
  useEffect(() => {
    // منع الخروج من الصفحة
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "If you leave the page, the exam will end. Are you sure?";
      return e.returnValue;
    };

    // اكتشاف تغيير التبويبات
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation();
      }
    };

    // منع مفاتيح الإختصار
    const handleKeyDown = (e: KeyboardEvent) => {
      const restrictedKeys = ["F12", "F5", "F11", "PrintScreen"];
      const restrictedCombinations = [
        e.ctrlKey && e.key === "r",
        e.ctrlKey && e.key === "n",
        e.ctrlKey && e.key === "t",
        e.altKey && e.key === "Tab",
        e.ctrlKey && e.shiftKey && e.key === "I",
        e.ctrlKey && e.shiftKey && e.key === "C",
        e.ctrlKey && e.shiftKey && e.key === "J",
      ];

      if (
        restrictedKeys.includes(e.key) ||
        restrictedCombinations.some(Boolean)
      ) {
        e.preventDefault();
        onViolation();
      }
    };

    // منع右键 القائمة
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViolation();
    };

    // إضافة event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    // منع الإنتقال للخلف
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
      onViolation();
    };

    // التنظيف
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.onpopstate = null;
    };
  }, [onViolation]);

  return null;
}
