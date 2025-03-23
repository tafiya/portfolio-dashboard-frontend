/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/UpdateServiceModal.tsx
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

interface Service {
  _id: string;
  num: string;
  title: string;
  description: string;
}

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  Service: Service | null;
  onUpdate: (updatedService: any) => void;
}

const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({
  isOpen,
  onClose,
  Service,
  onUpdate,
}) => {
  // Initialize react-hook-form with default values from the Service prop.
  const form = useForm({
    defaultValues: {
      title: Service?.title || "",
      num: Service?.num || "",
      description: Service?.description || "",
    },
  });
  // Watch for changes in 'Service' and update form values when modal opens
  useEffect(() => {
    if (Service) {
      form.reset({
        title: Service.title,
        num: Service.num,
        description: Service.description,
      });
    }
  }, [Service, form.reset]);

  // Local handleSave within the modal which calls the parent's onUpdate callback.
  const handleSave = async (values: any) => {
    try {
      const updatedService = { ...values };

      // Call the parent's onUpdate callback
      onUpdate(updatedService);
      toast.success("Service updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating Service:", error);
      toast.error("Failed to update Service. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-white">
        <DialogHeader>
          <DialogTitle>Update Service</DialogTitle>
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
                    <Input placeholder="Service Title" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Live URL" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
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

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceModal;
