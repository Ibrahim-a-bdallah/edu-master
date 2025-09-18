import Link from "next/link";
function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
  
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your lesson is now unlocked and ready to watch.
        </p>
        <Link
          href="/students/lessons"
          className="inline-block px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Go to Lessons
        </Link>
      </div>
    </div>
  );
}
export default SuccessPage;
