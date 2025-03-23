import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TEducation } from "@/types/product";
;

const educationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createEducation: builder.mutation({
            query: (formData) => ({
                url: "/education",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Education"],
        }),
        getAllEducation: builder.query({
            providesTags: ["Education"],
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
                //params.append("limit", "100"); // Ensure fetching all Education
                return {
                    url: `/education`,
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<TEducation[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
        }),
        getEducationById: builder.query({
            query: (id) => `/education/${id}`,
            providesTags: ["Education"],
        }),
        updateEducation: builder.mutation({
            query: ({ _id, updatedProduct }) => ({
                url: `/education/${_id}`,
                method: "PATCH",
                body: updatedProduct,
            }),
            invalidatesTags: ["Education"],
        }),
        deleteEducation: builder.mutation({
            query: (_id) => ({
                url: `/education/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Education"],
        }),
    }),
});

export const {
    useCreateEducationMutation,
    useGetAllEducationQuery,
    useGetEducationByIdQuery,
    useDeleteEducationMutation,
    useUpdateEducationMutation
} = educationApi;
