import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TService } from "@/types/product";

const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createService: builder.mutation({
            query: (formData) => ({
                url: "/service",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Service"],
        }),
        getAllService: builder.query({
            providesTags: ["Service"],
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
                //params.append("limit", "100"); // Ensure fetching all services
                return {
                    url: `/service`,
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<TService[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
        }),
        getServiceById: builder.query({
            query: (id) => `/service/${id}`,
            providesTags: ["Service"],
        }),
        updateService: builder.mutation({
            query: ({ _id, updatedProduct }) => ({
                url: `/service/${_id}`,
                method: "PATCH",
                body: updatedProduct,
            }),
            invalidatesTags: ["Service"],
        }),
        deleteService: builder.mutation({
            query: (_id) => ({
                url: `/service/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),
    }),
});

export const {
    useCreateServiceMutation,
    useGetAllServiceQuery,
    useGetServiceByIdQuery, useDeleteServiceMutation,
    useUpdateServiceMutation
} = serviceApi;
