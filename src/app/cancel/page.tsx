import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function CancelPage() {
  return (
  <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
      <Card className="shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-3xl text-gray-800">Payment Cancelled</CardTitle>
          <CardDescription className="text-gray-600">
            You cancelled the payment. You can try again whenever you're ready.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center mt-6">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/students/lessons">Back to Lessons</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default CancelPage;