"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import api from "@/lib/axios";
const Teachers = () => {
  const [totals, setTotals] = useState({ users: 0, lessons: 0, exams: 0 });
  const [classLevels, setClassLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [usersRes, lessonsRes, examsRes] = await Promise.all([
          api.get("/admin/all-user", {
            headers: { token: `${token}` },
          }),
          api.get("/lesson/", {
            headers: { token: `${token}` },
          }),
          api.get("/exam", {
            headers: { token: `${token}` },
          }),
        ]);
        // Calculate class level distribution
        const levelCounts: Record<string, number> = {};
        usersRes.data.data.forEach((user: any) => {
          const level = user.classLevel || "Unassigned";
          levelCounts[level] = (levelCounts[level] || 0) + 1;
        });

        setClassLevels(levelCounts);
        setTotals({
          users: usersRes.data.data.length,
          lessons: lessonsRes.data.data.length,
          exams: examsRes.data.data.length,
        });
      } catch (err) {
        setTotals({ users: 0, lessons: 0, exams: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchTotals();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-left text-gray-800">
        Teacher Dashboard
      </h2>
      {loading ? (
        Loading({ message: "Loading dashboard..." })
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-blue-600 mb-2">
                {totals.users}
              </span>
              <span className="text-lg text-gray-700">Total Users</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-green-600 mb-2">
                {totals.lessons}
              </span>
              <span className="text-lg text-gray-700">Total Lessons</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-5xl font-bold text-purple-600 mb-2">
                {totals.exams}
              </span>
              <span className="text-lg text-gray-700">Total Exams</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Content Distribution
              </h3>
              <div className="h-[300px] flex items-end justify-around">
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 bg-green-500 rounded-t"
                    style={{
                      height: `${
                        (totals.lessons /
                          Math.max(totals.lessons, totals.exams)) *
                        250
                      }px`,
                    }}
                  ></div>
                  <p className="mt-2 font-medium">Lessons</p>
                  <p className="text-sm text-gray-600">{totals.lessons}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 bg-purple-500 rounded-t"
                    style={{
                      height: `${
                        (totals.exams /
                          Math.max(totals.lessons, totals.exams)) *
                        250
                      }px`,
                    }}
                  ></div>
                  <p className="mt-2 font-medium">Exams</p>
                  <p className="text-sm text-gray-600">{totals.exams}</p>
                </div>
              </div>
            </div>

            {/* Class Level Distribution Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                Class Level Distribution
              </h3>
              <div className="h-[300px] flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-around">
                  {Object.entries(classLevels).map(([level, count], index) => {
                    const colors = [
                      "#10B981",
                      "#8B5CF6",
                      "#3B82F6",
                      "#EF4444",
                      "#F59E0B",
                    ];
                    const percentage = Math.round((count / totals.users) * 100);
                    return (
                      <div key={level} className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <div className="w-24 h-24 rounded-full border-8 border-gray-200">
                            <div
                              className="absolute inset-0 rounded-full border-8 border-transparent"
                              style={{
                                borderTopColor: colors[index % colors.length],
                                transform: `rotate(${percentage * 3.6}deg)`,
                                transition: "transform 1s ease-out",
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-center">{level}</p>
                        <p className="text-sm text-gray-600">
                          {count} students
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center gap-4">
                    {Object.entries(classLevels).map(
                      ([level, count], index) => {
                        const colors = [
                          "#10B981",
                          "#8B5CF6",
                          "#3B82F6",
                          "#EF4444",
                          "#F59E0B",
                        ];
                        return (
                          <div key={level} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: colors[index % colors.length],
                              }}
                            />
                            <span className="text-sm">
                              {level}:{" "}
                              {Math.round((count / totals.users) * 100)}%
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
