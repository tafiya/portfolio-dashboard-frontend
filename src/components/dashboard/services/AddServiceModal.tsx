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
import { useCreateServiceMutation } from "@/redux/features/service/serviceSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  num: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Details are required"),
});
interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [createService] = useCreateServiceMutation();
  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      num: "",
      description: "",
    },
  });

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    try {
      await createService(data).unwrap();
      console.log("from try", data);
      toast.success("service created successfully! Redirecting...");
      form.reset();
    } catch (error) {
      toast.error("service creation failed. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New service</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onsubmit)}
            className="pt-8 space-y-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
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
              name="num"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Number</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 border-[#00a76b]"
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Description</FormLabel>
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

            <Button
              className="bg-[#00a76b] hover:bg-[#00a76b]/40 hover:text-[#00a76b] text-lg hover:border-[#00a76b]"
              type="submit"
            >
              Create Service
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
