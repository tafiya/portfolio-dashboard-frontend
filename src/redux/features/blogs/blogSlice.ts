import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TBlog } from "@/types/product";
const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBlog: builder.mutation({
            query: (formData) => ({
                url: "/blogs",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Blogs"],
        }),
        getAllBlog: builder.query({
            providesTags: ["Blogs"],
            query: (args) => {
                const params = new URLSearchParams();
                if (args && Array.isArray(args)) {
                    // Ensure args is an array
                    args.forEach((item: TQueryParam) => {
                        if (item && item.name && item.value) {
                            params.append(item.name, item.value.toString());
                        }
                    });
                }
                //params.append("limit", "100"); // Ensure fetching all blog
                return {
                    url: `/blogs`,
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<TBlog[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
        }),
        getBlogById: builder.query({
            query: (id) => `/blogs/${id}`,
            providesTags: ["Blogs"],
        }),
        updateBlog: builder.mutation({
            query: ({ _id, updatedProduct }) => ({
                url: `/blogs/${_id}`,
                method: "PATCH",
                body: updatedProduct,
            }),
            invalidatesTags: ["Blogs"],
        }),
        deleteBlog: builder.mutation({
            query: (_id) => ({
                url: `/blogs/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blogs"],
        }),
    }),
});

export const {
    useCreateBlogMutation,
    useGetAllBlogQuery,
    useGetBlogByIdQuery,
    useDeleteBlogMutation,
    useUpdateBlogMutation
} = blogApi;
