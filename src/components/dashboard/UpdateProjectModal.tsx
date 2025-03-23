/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/UpdateProjectModal.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  mainImg: string;
  details: string;
  shortDetails: string;
  liveLink: string;
  githubServerLink: string;
  githubClientLink: string;
}

interface UpdateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (updatedProject: any) => void;
}

const UpdateProjectModal: React.FC<UpdateProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize react-hook-form with default values from the project prop.
  const form = useForm({
    defaultValues: {
      title: project?.title || "",
      mainImg: project?.mainImg || "",
      details: project?.details || "",
      shortDetails: project?.shortDetails || "",
      liveLink: project?.liveLink || "",
      githubServerLink: project?.githubServerLink || "",
      githubClientLink: project?.githubClientLink || "",
    },
  });
  // Watch for changes in 'project' and update form values when modal opens
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        mainImg: project.mainImg,
        details: project.details,
        shortDetails: project.shortDetails,
        liveLink: project.liveLink,
        githubServerLink: project.githubServerLink,
        githubClientLink: project.githubClientLink,
      });
    }
  }, [project, form.reset]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Local handleSave within the modal which calls the parent's onUpdate callback.
  const handleSave = async (values: any) => {
    try {
      let imageUrl = project?.mainImg; // Keep existing image by default

      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
        }
        setUploading(false);
      }

      // Prepare updated project data by merging form values and the (possibly) new image URL.
      const updatedProject = { ...values, mainImg: imageUrl };

      // Call the parent's onUpdate callback
      onUpdate(updatedProject);
      toast.success("Project updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-white">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" required {...field} />
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
                  <FormLabel>Live Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Live URL" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Details</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Short Description"
                      required
                      {...field}
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
                  <FormLabel>GitHub Server Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="GitHub Server Link"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubClientLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Client Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="GitHub Client Link"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label>Main Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {uploading && <p className="text-blue-500">Uploading image...</p>}

            <Button type="submit" disabled={uploading}>
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProjectModal;
