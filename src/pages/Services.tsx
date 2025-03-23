import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

import {
  useDeleteServiceMutation,
  useGetAllServiceQuery,
  useUpdateServiceMutation,
} from "@/redux/features/service/serviceSlice";
import UpdateServiceModal from "@/components/dashboard/services/UpdateService";
import AddServiceModal from "@/components/dashboard/services/AddServiceModal";

interface Service {
  _id: string;
  num: string;
  title: string;
  description: string;
}
const Services: React.FC = () => {
  const { data, isFetching } = useGetAllServiceQuery(undefined);
  const [deleteService] = useDeleteServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRemove = async (id: string) => {
    await deleteService(id);
    toast.success("Service deleted successfully!");
  };

  const handleUpdate = (Service: Service) => {
    setSelectedService(Service);
    setIsUpdateModalOpen(true);
  };

  // Define handleSave here so that it is available when passed to the modal.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (updatedService: any) => {
    if (!selectedService) return;
    try {
      await updateService({
        _id: selectedService._id,
        updatedProduct: updatedService,
      }).unwrap();
      toast.success("Service updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update Service. Please try again.");
    }
  };
  return (
    <>
      {isFetching && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <Card className="p-6 mx-auto">
        <div className="flex justify-between mb-4">
          <Button onClick={() => setIsAddModalOpen(true)}>Add Service</Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Num</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((Service: Service) => (
                <TableRow key={Service.num}>
                  <TableCell className="whitespace-normal break-words">
                    {Service.num}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {Service.title}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {Service.description}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(Service._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdate(Service)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <UpdateServiceModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          Service={selectedService}
          onUpdate={handleSave}
        />
        <AddServiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Card>
    </>
  );
};

export default Services;
