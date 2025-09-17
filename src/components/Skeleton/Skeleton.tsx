// components/StudentsSkeleton.tsx

import { Skeleton } from "../ui/skeleton";

export default function StudentsSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* السيدبار - Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        {/* لوغو التحميل */}
        <div className="flex items-center mb-8">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-6 w-32 ml-2" />
        </div>

        {/* عناصر القائمة */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center p-2 rounded-md">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-40 ml-3" />
            </div>
          ))}
        </div>

        {/* زر الخروج */}
        <div className="mt-8 p-2">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col">
        {/* الهيدر - Header */}
        <header className="bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="hidden md:block">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </header>

        {/* الداشبورد - Dashboard */}
        <main className="flex-1 p-6 overflow-auto">
          {/* عنوان الصفحة */}
          <Skeleton className="h-8 w-64 mb-6" />

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>

          {/* جدول الطلاب */}
          <div className="bg-white rounded-lg border">
            {/* رأس الجدول */}
            <div className="border-b p-4">
              <Skeleton className="h-6 w-48" />
            </div>

            {/* عناصر التحكم */}
            <div className="p-4 flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* جدول التحميل */}
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {[...Array(5)].map((_, i) => (
                        <th key={i} className="px-6 py-3">
                          <Skeleton className="h-4 w-24 mx-auto" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {[...Array(5)].map((_, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4">
                            <Skeleton className="h-4 w-32 mx-auto" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* التذييل - Pagination */}
            <div className="border-t p-4 flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
