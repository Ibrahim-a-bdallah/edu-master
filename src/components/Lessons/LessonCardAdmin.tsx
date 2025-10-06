// components/lessons/LessonCardAdmin.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  Video,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  actUpdateLesson,
  actDeleteLesson,
} from "@/store/lessons/lessonAdminSlice";
import { Lesson } from "@/lib/lessonService";

interface LessonCardAdminProps {
  lesson: Lesson;
}

export default function LessonCardAdmin({ lesson }: LessonCardAdminProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // حالة نموذج التعديل
  const [editForm, setEditForm] = useState({
    title: lesson.title,
    description: lesson.description,
    video: lesson.video,
    classLevel: lesson.classLevel,
    price: lesson.price,
  });

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        actUpdateLesson({ token, id: lesson._id, data: editForm })
      ).unwrap();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error editing lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(actDeleteLesson({ token, id: lesson._id })).unwrap();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriceColor = (price: number) => {
    if (price <= 30) return "bg-green-100 text-green-800";
    if (price <= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      {/* Lesson Card */}
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex space-x-2">
              <Badge className={getPriceColor(lesson.price)}>
                <DollarSign className="w-3 h-3 mr-1" />
                {lesson.price} EGP
              </Badge>
              <Badge variant={lesson.isPaid ? "default" : "secondary"}>
                {lesson.isPaid ? "Paid" : "Free"}
              </Badge>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(lesson.createdAt)}
            </span>
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {lesson.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {lesson.description}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>{lesson.classLevel}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(lesson.scheduledDate)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewDialogOpen(true)}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              className="flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {lesson.title}
            </DialogTitle>
            <DialogDescription>
              Lesson details and information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Price</Label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{lesson.price} EGP</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant={lesson.isPaid ? "default" : "secondary"}>
                    {lesson.isPaid ? "Paid Lesson" : "Free Lesson"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Class Level</Label>
                <p className="mt-1 text-sm">{lesson.classLevel}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Scheduled Date</Label>
                <p className="mt-1 text-sm">
                  {formatDate(lesson.scheduledDate)}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                {lesson.description}
              </p>
            </div>

            {lesson.video && (
              <div>
                <Label className="text-sm font-medium flex items-center">
                  <Video className="w-4 h-4 mr-2" />
                  Video Content
                </Label>
                <a
                  href={lesson.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:underline block"
                >
                  {lesson.video}
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Created</Label>
                <p>{formatDate(lesson.createdAt)}</p>
              </div>
              <div>
                <Label className="font-medium">Last Updated</Label>
                <p>{formatDate(lesson.updatedAt)}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
            <DialogDescription>
              Update the lesson information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Lesson title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Lesson description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classLevel">Class Level</Label>
                <Input
                  id="classLevel"
                  value={editForm.classLevel}
                  onChange={(e) =>
                    setEditForm({ ...editForm, classLevel: e.target.value })
                  }
                  placeholder="e.g., Grade 1 Secondary"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (EGP)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                value={editForm.video}
                onChange={(e) =>
                  setEditForm({ ...editForm, video: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lesson "{lesson.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Lesson"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
