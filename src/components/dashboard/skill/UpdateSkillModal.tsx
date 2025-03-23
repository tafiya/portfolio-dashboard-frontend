/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/UpdateSkillModal.tsx
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

interface Skill {
  _id: string;
  name: string;
  img: string;
  ability: string;
}

interface UpdateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  Skill: Skill | null;
  onUpdate: (updatedSkill: any) => void;
}

const UpdateSkillModal: React.FC<UpdateSkillModalProps> = ({
  isOpen,
  onClose,
  Skill,
  onUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize react-hook-form with default values from the Skill prop.
  const form = useForm({
    defaultValues: {
      name: Skill?.name || "",
      img: Skill?.img || "",
      ability: Skill?.ability || "",
    },
  });
  // Watch for changes in 'Skill' and update form values when modal opens
  useEffect(() => {
    if (Skill) {
      form.reset({
        name: Skill?.name,
        img: Skill?.img,
        ability: Skill?.ability,
      });
    }
  }, [Skill, form.reset]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Local handleSave within the modal which calls the parent's onUpdate callback.
  const handleSave = async (values: any) => {
    try {
      let imageUrl = Skill?.img; // Keep existing image by default

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

      // Prepare updated Skill data by merging form values and the (possibly) new image URL.
      const updatedSkill = { ...values, img: imageUrl };

      // Call the parent's onUpdate callback
      onUpdate(updatedSkill);
      toast.success("Skill updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating Skill:", error);
      toast.error("Failed to update Skill. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-white">
        <DialogHeader>
          <DialogTitle>Update Skill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Skill Title" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ability</FormLabel>
                  <FormControl>
                    <Input placeholder="Live URL" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Label>Icon Image</Label>
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

export default UpdateSkillModal;
