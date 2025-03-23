import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TProject } from "@/types/product";
;

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (formData) => ({
        url: "/projects",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),
    getAllProject: builder.query({
      providesTags: ["Projects"],
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
        //params.append("limit", "100"); // Ensure fetching all Projects
        return {
          url: `/projects`,
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<TProject[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),
    updateProject: builder.mutation({
      query: ({ _id, updatedProduct }) => ({
        url: `/projects/${_id}`,
        method: "PATCH",
        body: updatedProduct,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation({
      query: (_id) => ({
        url: `/projects/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectQuery,
  useGetProjectByIdQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation
} = projectApi;
