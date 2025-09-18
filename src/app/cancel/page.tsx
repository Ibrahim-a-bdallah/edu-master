import Link from "next/link";

function CancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You cancelled the payment. You can try again whenever you're ready.
        </p>
        <Link
          href="/students/lessons"
          className="inline-block px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Back to Lessons
        </Link>
      </div>
    </div>
  );
}
export default CancelPage;