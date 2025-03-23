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
import {
  useDeleteProjectMutation,
  useGetAllProjectQuery,
  useUpdateProjectMutation,
} from "@/redux/features/projects/projectSlice";
import UpdateProjectModal from "@/components/dashboard/UpdateProjectModal";

import toast from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  mainImg: string;
  shortDetails: string;
  details: string;
  liveLink: string;
  githubServerLink: string;
  githubClientLink: string;
}

const Projects: React.FC = () => {
  const { data, isFetching } = useGetAllProjectQuery(undefined);
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleRemove = async (id: string) => {
    await deleteProject(id);
    toast.success("Project deleted successfully!");
  };

  const handleUpdate = (project: Project) => {
    setSelectedProject(project);
    setIsUpdateModalOpen(true);
  };

  // Define handleSave here so that it is available when passed to the modal.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (updatedProject: any) => {
    if (!selectedProject) return;
    try {
      await updateProject({
        _id: selectedProject._id,
        updatedProduct: updatedProject,
      }).unwrap();
      toast.success("Project updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Short Details</TableHead>

                <TableHead>Live Link</TableHead>
                <TableHead>GitHub Client</TableHead>
                <TableHead>GitHub Server</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((project: Project) => (
                <TableRow key={project._id}>
                  <TableCell className="whitespace-normal break-words">
                    {project.title}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {project.shortDetails}
                  </TableCell>
                  {/* <TableCell className="whitespace-normal break-words">
                    {project.details}
                  </TableCell> */}
                  <TableCell className="whitespace-normal break-words">
                    {project.liveLink}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {project.githubClientLink}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {project.githubServerLink}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(project._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdate(project)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <UpdateProjectModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          project={selectedProject}
          onUpdate={handleSave}
        />
      </Card>
    </>
  );
};

export default Projects;
