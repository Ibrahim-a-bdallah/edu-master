import { Exam } from "@/app/types/exams";
import { FaCalendar } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
const ExamCard = ({
  exam,
  onViewDetails,
}: {
  exam: Exam;
  onViewDetails: () => void;
}) => (
  <div className="border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
    <p className="text-gray-600 mb-1">Class level : {exam.classLevel}</p>
    <p className="text-gray-600 mb-1 flex-1">Description : {exam.description}</p>

    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-2">
      <div className="text-[#333437] flex items-center gap-1">
        <FaCalendar className="text-xl md:text-2xl" />
        <h1 className="text-sm md:text-base">
          {new Date(exam.endDate).toLocaleDateString()}
        </h1>
      </div>
      <div className="text-[#333437] flex items-center gap-1">
        <MdOutlineAccessTime className="text-xl md:text-2xl" />
        <h1 className="text-sm md:text-base">{exam.duration} mins</h1>
      </div>
    </div>

    <p className="text-gray-600 mb-1 mt-2">Questions : {exam.questions.length}</p>
    <div className="flex items-center justify-between mt-2">
      <p className="text-gray-600">Passing Percentage</p>
      <p className="text-gray-600">70%</p>
    </div>
    <div className="h-2 w-full bg-gray-200 rounded-full mb-4 mt-2">
      <div className="h-full bg-main rounded-full" style={{ width: "70%" }} />
    </div>
    <button
      onClick={onViewDetails}
      className="bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 hover:scale-95 transition-colors text-center duration-300 cursor-pointer w-full mt-auto"
    >
      View Details
    </button>
  </div>
);

export default ExamCard;