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
  useDeleteSkillMutation,
  useGetAllSkillQuery,
  useUpdateSkillMutation,
} from "@/redux/features/skill/skillSlice";
import UpdateSkillModal from "@/components/dashboard/skill/UpdateSkillModal";
import AddSkillModal from "@/components/dashboard/skill/AddSkillModal";

interface Skill {
  _id: string;
  name: string;
  img: string;
  ability: string;
}

const Skill: React.FC = () => {
  const { data, isFetching } = useGetAllSkillQuery(undefined);
  const [deleteSkill] = useDeleteSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRemove = async (id: string) => {
    await deleteSkill(id);
    toast.success("Skill deleted successfully!");
  };

  const handleUpdate = (Skill: Skill) => {
    setSelectedSkill(Skill);
    setIsUpdateModalOpen(true);
  };

  // Define handleSave here so that it is available when passed to the modal.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (updatedSkill: any) => {
    if (!selectedSkill) return;
    try {
      await updateSkill({
        _id: selectedSkill._id,
        updatedProduct: updatedSkill,
      }).unwrap();
      toast.success("Skill updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update Skill. Please try again.");
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
          <Button onClick={() => setIsAddModalOpen(true)}>Add Skill</Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ability</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((Skill: Skill) => (
                <TableRow key={Skill._id}>
                  <TableCell className="whitespace-normal break-words">
                    {Skill.name}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {Skill.ability}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(Skill._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdate(Skill)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <UpdateSkillModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          Skill={selectedSkill}
          onUpdate={handleSave}
        />
        <AddSkillModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Card>
    </>
  );
};

export default Skill;
