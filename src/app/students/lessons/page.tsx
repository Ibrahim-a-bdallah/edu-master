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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Lessons
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessonsData.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default Lessons;
