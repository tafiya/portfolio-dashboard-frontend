/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateSkillMutation } from "@/redux/features/skill/skillSlice";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import * as z from "zod";

const SkillSchema = z.object({
  name: z.string().min(1, "Skill Name is required"),
  img: z.string(),
  ability: z.string(),
});
interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose }) => {
  const [createSkill] = useCreateSkillMutation();
  const [uploading, setUploading] = useState(false);
  const form = useForm({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      name: "",
      img: "",
      ability: "",
    },
  });

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
        form.setValue("img", imageUrl);
      }
    }
  };

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await createSkill(data).unwrap();
      toast.success("Skill created successfully! Redirecting...");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Skill creation failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onsubmit)}
            className="pt-8 space-y-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b]"
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
              name="ability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Ability</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b]"
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

            <div className="mt-2">
              <Label className="text-lg">Icon Image</Label>
              <Input
                className="border-[#00a76b]"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {uploading && <p className="text-blue-500">Uploading image...</p>}
            </div>

            <Button
              className="bg-[#00a76b] hover:bg-[#00a76b]/40 hover:text-[#00a76b] text-lg hover:border-[#00a76b]"
              type="submit"
              disabled={uploading}
            >
              Create Skill
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillModal;
