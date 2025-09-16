import { Lesson } from "@/app/types/lesson";

interface LessonCardProps {
  lesson: Lesson;
}const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {lesson.classLevel}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-3 line-clamp-3">{lesson.description}</p>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-4">
        {lesson.scheduledDate
          ? new Date(lesson.scheduledDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "No schedule"}
      </p>

      {/* Price */}
      <div className="mb-4">
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

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        <a
          href={lesson.video}
          target="_blank"
          className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Watch
        </a>
        {lesson.isPaid && (
          <button className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">
            Pay
          </button>
        )}
      </div>
    </div>
  );
};
export default LessonCard;
