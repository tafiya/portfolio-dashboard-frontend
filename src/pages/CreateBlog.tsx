/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBlogMutation } from "@/redux/features/blogs/blogSlice";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as z from "zod";

// ✅ Blog Form Validation Schema
const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  blogImg: z.string(),
  detail: z.string(),
  author: z.string().min(1, "Author name is required"),
  authorPicture: z.string(),
});

// interface CreateBlogModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

const CreateBlog = () => {
  const [createBlog] = useCreateBlogMutation();
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: "",
      content: "",
      blogImg: "",
      detail: "",
      author: "",
      authorPicture: "",
    },
  });

  // ✅ Upload Image to Cloudinary
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_preset"); // Replace with your Cloudinary preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/demnpqwx3/image/upload",
        formData
      );
      setUploading(false);
      return response.data.secure_url; // ✅ Return uploaded image URL
    } catch (error) {
      console.error("Image upload failed", error);
      setUploading(false);
      return null;
    }
  };

  // ✅ Handle File Change for Blog Image
  const handleBlogImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("blogImg", imageUrl);
      }
    }
  };

  // ✅ Handle File Change for Author Picture
  const handleAuthorPictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("authorPicture", imageUrl);
      }
    }
  };

  // ✅ Handle Blog Submission
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await createBlog(data).unwrap();
      toast.success("Blog created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to create blog. Please try again.");
    }
  };

  return (
    <div className=" w-2/3 mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pt-6 space-y-4 w-full border"
        >
          <div className="flex">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="p-4 border-gray-400"
                      placeholder="Enter blog title"
                      required
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Author Name */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Author</FormLabel>
                  <FormControl>
                    <Input
                      className="p-4 border-gray-400"
                      placeholder="Author name"
                      required
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Blog Title */}
          <div className=" flex">
            {/* Blog Image Upload */}
            <div className="mt-2">
              <Label className="text-lg">Blog Image</Label>
              <Input
                className="border-gray-400"
                type="file"
                accept="image/*"
                onChange={handleBlogImageChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>

            {/* Author Picture Upload */}
            <div className="mt-2">
              <Label className="text-lg">Author Picture</Label>
              <Input
                className="border-gray-400"
                type="file"
                accept="image/*"
                onChange={handleAuthorPictureChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>
          </div>
          {/* Blog Content - ReactQuill Editor */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Content</FormLabel>
                <FormControl>
                  <div className="w-full">
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="  bg-white"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blog Short Detail */}
          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Short Detail</FormLabel>
                <FormControl>
                  <Input
                    className="p-4 border-gray-400"
                    placeholder="Enter short summary"
                    required
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="bg-green-600 hover:bg-green-700 text-lg text-white"
            type="submit"
            disabled={uploading}
          >
            Create Blog
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBlog;
