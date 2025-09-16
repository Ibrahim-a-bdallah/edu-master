import LessonCard from "@/app/components/LessonCard";
import { Lesson } from "@/app/types/lesson";
const Lessons = async () => {
  let lessonsData: Lesson[] = [];
  try {
    const res = await fetch("https://edu-master-delta.vercel.app/lesson", {
      headers: {
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vdXJoYW50YWhhNTg4QGdtYWlsLmNvbSIsIl9pZCI6IjY4YzgzMmRiZWZhYTE4OWQwMDM5MDBhNSIsImlhdCI6MTc1Nzk1MTA0NCwiZXhwIjoxNzU4MDM3NDQ0fQ.6Zh8dWVwwKUl6Vk9ee1oE88v2bF4dIsbC6bjbug1zQQ", // 👈 من env
      },
      cache: "no-store",
    });
    const data = await res.json();
    lessonsData = data.data || [];
    console.log('lessonsData:', lessonsData);
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }


  if (!lessonsData.length) {
    return <p className="text-center py-8">No lessons available.</p>;

interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
  isPaid: boolean;
}
const lessons = () => {
  const [lessonsData, setLessonsData] = useState<Lesson[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  // Fetch lessons from the API
  const fetchLessons = async () => {
    try {
      const res = await axios.get(
        "https://edu-master-delta.vercel.app/lesson/?classLevel=Grade 1 Secondary&isPaid=true",
        {
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vb3JoYW5AZ21haWwuY29tIiwiX2lkIjoiNjhjNTI4MzI3ODljNjliOTY4YTc2NTZlIiwiaWF0IjoxNzU3ODc2MDEyLCJleHAiOjE3NTc5NjI0MTJ9.iOUTIFEwaMKIo94TZMcd3-yqxKUWGRPa8TvmDpAFrZY",
          },
        }
      );
      const data = await res.data;

      setLessonsData(data.data || []);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);
  if (loading) {
    return <p className="text-center py-8">Loading lessons...</p>;

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Lessons
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessonsData.map((lesson) => (

          <LessonCard key={lesson._id} lesson={lesson} />

          <div
            key={lesson._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {lesson.title}
              </h2>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {lesson.classLevel}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-3 line-clamp-3">
              {lesson.description}
            </p>

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

        ))}
      </div>
    </div>
  );
};


export default Lessons;
