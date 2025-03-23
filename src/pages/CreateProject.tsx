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

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from "zod";
import { useCreateProjectMutation } from "@/redux/features/projects/projectSlice";
import ReactQuill from "react-quill";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  num: z.string(),
  mainImg: z.string().url("Invalid image URL"),
  image1: z.string().url("Invalid image URL"),
  image2: z.string().url("Invalid image URL"),
  image3: z.string().url("Invalid image URL"),
  details: z.string().min(1, "Details are required"),
  category: z.string(),
  shortDetails: z.string().min(1, "Short details are required"),
  liveLink: z.string().url("Invalid URL"),
  githubServerLink: z.string().url("Invalid URL"),
  githubClientLink: z.string().url("Invalid URL"),
  stack: z
    .array(z.object({ name: z.string().min(1, "Stack name is required") }))
    .optional(), // Added stack field
});
const CreateProject = () => {
  const [createProject] = useCreateProjectMutation();
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      num: "",
      mainImg: "",
      image1: "",
      image2: "",
      category: "",
      image3: "",
      details: "",
      shortDetails: "",
      liveLink: "",
      githubServerLink: "",
      githubClientLink: "",
    },
  });
  const [stackItems, setStackItems] = useState<{ name: string }[]>([]); // Explicitly define type
  const [stackInput, setStackInput] = useState<string>(""); // Define stackInput as a string

  const handleAddStack = () => {
    if (stackInput.trim()) {
      setStackItems((prevStack) => [...prevStack, { name: stackInput.trim() }]); // Add stack item
      setStackInput(""); // Clear input field
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveStack = (index: any) => {
    setStackItems(stackItems.filter((_, i) => i !== index)); // Remove stack item
  };

  // ✅ Handle image upload to Cloudinary
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_preset"); // 🔹 Replace with your Cloudinary preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/demnpqwx3/image/upload",
        formData
      );
      setUploading(false);
      return response.data.secure_url; // ✅ Get the uploaded image URL
    } catch (error) {
      console.error("Image upload failed", error);
      setUploading(false);
      return null;
    }
  };

  //  Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("mainImg", imageUrl);
      }
    }
  };
  //  Handle file input change
  const handleCoverFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("image1", imageUrl);
      }
    }
  };
  const handleImage2FileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("image2", imageUrl);
      }
    }
  };
  const handleImage3FileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const imageUrl = await uploadImage(e.target.files[0]);
      if (imageUrl) {
        form.setValue("image3", imageUrl);
      }
    }
  };

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formattedData = {
        ...data,
        stack: stackItems.map((item: { name: string }) => ({
          name: item.name,
        })), // Ensure correct format
      };

      await createProject(formattedData).unwrap();
      toast.success("Project created successfully! Redirecting...");
      form.reset();
    } catch (error) {
      toast.error("Project creation failed. Please try again.");
    }
  };
  return (
    <div className=" md:w-2/3 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="pt-8 space-y-3">
          <div className="flex flex-wrap justify-between">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="Title"
                      required
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Live Link</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="Live URL"
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
          <div className="flex flex-wrap justify-between mb-2">
            <FormField
              control={form.control}
              name="shortDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Short Details</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="Short Details"
                      required
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubServerLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">GitHub Server Link</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="GitHub Server Link"
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
          <div className="flex flex-wrap justify-between mb-2">
            <FormField
              control={form.control}
              name="githubClientLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">GitHub Client Link</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="GitHub Client Link"
                      required
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Category</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="Title"
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
          <div className="flex flex-wrap justify-between mb-2">
            <div className="mt-2">
              <Label className="text-lg">Main Image</Label>
              <Input
                className=" border-[#00a76b] w-80 md:w-96"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>
            <div className="mt-2">
              <Label className="text-lg">Cover Image</Label>
              <Input
                className="border-[#00a76b] w-80 md:w-96"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>
          </div>
          <div className="flex flex-wrap justify-between mb-2">
            <div className="mt-2">
              <Label className="text-lg">Image</Label>
              <Input
                className=" border-[#00a76b] w-80 md:w-96"
                type="file"
                accept="image/*"
                onChange={handleImage2FileChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>
            <div className="mt-2">
              <Label className="text-lg">Image</Label>
              <Input
                className=" border-[#00a76b] w-80 md:w-96"
                type="file"
                accept="image/*"
                onChange={handleImage3FileChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>
          </div>
          <div>
            <FormLabel className="text-lg">Technology Stack</FormLabel>
            <div className="flex items-center space-x-3">
              <Input
                className="p-5 border-[#00a76b] w-80 md:w-96"
                placeholder="Enter a technology (e.g., React.js)"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddStack}
                className="bg-[#00a76b] text-white"
              >
                Add
              </Button>
            </div>
            {/* Display Stack List */}
            <div className="mt-2">
              {stackItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-1"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStack(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Serial number</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b] w-80 md:w-96"
                      placeholder="Serial number"
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
          <div className="md:pb-10 pb-16">
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Details</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className=" md:max-w-2xl max-w-80 bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="bg-[#00a76b] hover:bg-[#00a76b]/40 hover:text-[#00a76b] text-lg hover:border-[#00a76b]"
            type="submit"
            disabled={uploading}
          >
            Create Project
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProject;
