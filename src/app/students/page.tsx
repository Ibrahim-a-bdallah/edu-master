"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  BookOpen,
  Clock,
  Award,
  Calendar,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { Lesson } from "../types/lesson";
import { fetchLessons } from "@/store/lessons/lessonSlice";

// أنواع البيانات
interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  averageScore: number;
  streak: number;
}

interface RecentLesson {
  id: string;
  title: string;
  subject: string;
  date: string;
  status: "completed" | "in-progress" | "upcoming";
  score?: number;
}

const StudentDashboard = () => {
  const dispatch = useAppDispatch();
  const { UserData } = useAppSelector((state) => state.profile);
  const { lessons } = useAppSelector((state) => state.lessons);
  const { token } = useAppSelector((state) => state.auth);

  const [stats, setStats] = useState<StudentStats>({
    totalLessons: 0,
    completedLessons: 0,
    upcomingLessons: 0,
    averageScore: 0,
    streak: 0,
  });

  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchLessons({ token }));
    if (lessons.length > 0) {
      calculateStats();
      setLoading(false);
    }
  }, [dispatch, token, lessons]);

  const calculateStats = () => {
    // محاكاة بيانات الطالب (في الواقع ستأتي من API)
    const completed = Math.floor(lessons.length * 0.6); // 60% مكتمل
    const upcoming = lessons.filter(
      (lesson: Lesson) => new Date(lesson.scheduledDate) > new Date()
    ).length;

    setStats({
      totalLessons: lessons.length,
      completedLessons: completed,
      upcomingLessons: upcoming,
      averageScore: 85, // محاكاة
      streak: 7, // محاكاة
    });

    // محاكاة الدروس الحديثة
    setRecentLessons([
      {
        id: "1",
        title: "Mathematics - Algebra Basics",
        subject: "Mathematics",
        date: "2024-01-15",
        status: "completed",
        score: 92,
      },
      {
        id: "2",
        title: "Physics - Newton's Laws",
        subject: "Physics",
        date: "2024-01-16",
        status: "in-progress",
      },
      {
        id: "3",
        title: "Chemistry - Periodic Table",
        subject: "Chemistry",
        date: "2024-01-17",
        status: "upcoming",
      },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {UserData?.data.fullName || "Student"}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your learning progress overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Lessons"
            value={stats.totalLessons.toString()}
            icon={<BookOpen className="h-6 w-6 text-blue-600" />}
            description="All available lessons"
            color="blue"
          />

          <StatsCard
            title="Completed"
            value={stats.completedLessons.toString()}
            icon={<Award className="h-6 w-6 text-green-600" />}
            description="Lessons finished"
            color="green"
          />

          <StatsCard
            title="Upcoming"
            value={stats.upcomingLessons.toString()}
            icon={<Calendar className="h-6 w-6 text-orange-600" />}
            description="Scheduled lessons"
            color="orange"
          />

          <StatsCard
            title="Current Streak"
            value={`${stats.streak} days`}
            icon={<Star className="h-6 w-6 text-purple-600" />}
            description="Learning streak"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Your overall course completion progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Course Completion</span>
                    <span className="font-semibold">
                      {Math.round(
                        (stats.completedLessons / stats.totalLessons) * 100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(stats.completedLessons / stats.totalLessons) * 100}
                    className="h-3"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.averageScore}%
                      </div>
                      <div className="text-sm text-blue-600">Average Score</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(
                          (stats.completedLessons / stats.totalLessons) * 100
                        )}
                        %
                      </div>
                      <div className="text-sm text-green-600">
                        Completion Rate
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Lessons */}
            <RecentLessonsList lessons={recentLessons} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Lessons */}
            <UpcomingLessonsCard lessons={lessons.slice(0, 3)} />

            {/* Quick Actions */}
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون بطاقة الإحصائيات
const StatsCard = ({
  title,
  value,
  icon,
  description,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
    <div
      className={`absolute bottom-0 left-0 w-full h-1 bg-${color}-500`}
    ></div>
  </Card>
);

// مكون قائمة الدروس الحديثة
const RecentLessonsList = ({ lessons }: { lessons: RecentLesson[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Activity
      </CardTitle>
      <CardDescription>Your recent lesson progress</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  lesson.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : lesson.status === "in-progress"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <PlayCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">{lesson.title}</div>
                <div className="text-xs text-gray-500">
                  {lesson.subject} • {lesson.date}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lesson.score && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  {lesson.score}%
                </Badge>
              )}
              <Badge
                variant={
                  lesson.status === "completed"
                    ? "default"
                    : lesson.status === "in-progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {lesson.status.replace("-", " ")}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// مكون الدروس القادمة
const UpcomingLessonsCard = ({ lessons }: { lessons: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Upcoming Lessons
      </CardTitle>
      <CardDescription>Scheduled lessons for this week</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {lessons.slice(0, 3).map((lesson, index) => (
          <div
            key={lesson._id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{lesson.title}</div>
              <div className="text-xs text-gray-500">
                {lesson.scheduledDate
                  ? new Date(lesson.scheduledDate).toLocaleDateString()
                  : "No date"}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {lesson.classLevel}
            </Badge>
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No upcoming lessons
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// مكون الإجراءات السريعة
const QuickActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Jump back into learning</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Button className="w-full justify-start gap-2" variant="outline">
          <PlayCircle className="h-4 w-4" />
          Continue Learning
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <BookOpen className="h-4 w-4" />
          Browse Lessons
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Award className="h-4 w-4" />
          View Achievements
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Users className="h-4 w-4" />
          Study Groups
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default StudentDashboard;
