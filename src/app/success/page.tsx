import PaidLesson from "@/components/PaidLesson";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
function SuccessPage() {
  return ( 
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      {<PaidLesson/>} 
      <Card className="shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-3xl text-gray-800 mb-2">Payment Successful</CardTitle>
          <CardDescription className="text-gray-600">
            Thank you for your purchase! Your lesson is now unlocked and ready to watch.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center mt-6">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/students/lessons">Go to Lessons</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default SuccessPage;
