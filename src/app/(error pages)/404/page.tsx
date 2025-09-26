"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  AlertCircle,
  Navigation,
  Clock,
  Users,
} from "lucide-react";

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const popularLinks = [
    { href: "/students", label: "Student Dashboard", icon: BookOpen },
    { href: "/students/lessons", label: "Browse Lessons", icon: Navigation },
    { href: "/students/schedule", label: "Class Schedule", icon: Clock },
    { href: "/students/community", label: "Student Community", icon: Users },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl w-full">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="text-9xl font-bold text-gray-200 relative">
              4
              <span className="absolute inset-0 text-blue-600 animate-ping opacity-75">
                0
              </span>
              <span className="absolute inset-0 text-blue-700">0</span>4
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Lost in Space? 🚀
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Don't worry, even astronauts get lost sometimes. Let's navigate back
            to safety!
          </p>
        </div>

        {/* Search Section */}
        <Card className="shadow-xl border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Try searching for lessons, dashboard, or your profile
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                Quick Navigation
              </h2>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full gap-2 justify-start"
                  variant="outline"
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Homepage
                  </Link>
                </Button>

                <Button
                  asChild
                  className="w-full gap-2 justify-start"
                  variant="outline"
                >
                  <Link href="/student/dashboard">
                    <BookOpen className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Links Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Popular Destinations
              </h2>

              <div className="space-y-2">
                {popularLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all group"
                  >
                    <link.icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-gray-700 group-hover:text-blue-900">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="shadow-lg border-0 mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Still Can't Find What You Need?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you navigate back to the right
                path.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/help">Help Center</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Facts */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            💡 Did you know? This 404 page has been visited by{" "}
            {Math.floor(Math.random() * 1000) + 1} lost explorers today!
          </p>
        </div>
      </div>
    </div>
  );
}
