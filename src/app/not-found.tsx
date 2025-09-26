import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundSimple() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/students">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
