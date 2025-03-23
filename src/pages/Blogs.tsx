import React from "react";
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
  useDeleteBlogMutation,
  useGetAllBlogQuery,
} from "@/redux/features/blogs/blogSlice";

interface Blog {
  _id: string;
  title: string;
  blogImg: string;
  content: string;
  detail: string;
  author: string;
  authorPicture: string;
}

const Blogs: React.FC = () => {
  const { data, isFetching } = useGetAllBlogQuery(undefined);
  const [deleteBlog] = useDeleteBlogMutation();

  const handleRemove = async (id: string) => {
    await deleteBlog(id);
    toast.success("Blog deleted successfully!");
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
                <TableHead>Detail</TableHead>

                <TableHead>Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((Blog: Blog) => (
                <TableRow key={Blog._id}>
                  <TableCell className="whitespace-normal break-words">
                    {Blog.title}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words">
                    {Blog.detail}
                  </TableCell>
                  {/* <TableCell className="whitespace-normal break-words">
                    {Blog.details}
                  </TableCell> */}
                  <TableCell className="whitespace-normal break-words">
                    {Blog.author}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(Blog._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default Blogs;
