import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TAbout } from "@/types/product";
;

const AboutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createAbout: builder.mutation({
            query: (formData) => ({
                url: "/about",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["About"],
        }),
        getAllAbout: builder.query({
            providesTags: ["About"],
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
                //params.append("limit", "100"); // Ensure fetching all About
                return {
                    url: `/about`,
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<TAbout[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
        }),
        getAboutById: builder.query({
            query: (id) => `/about/${id}`,
            providesTags: ["About"],
        }),
        updateAbout: builder.mutation({
            query: ({ _id, updatedProduct }) => ({
                url: `/about/${_id}`,
                method: "PATCH",
                body: updatedProduct,
            }),
            invalidatesTags: ["About"],
        }),
        deleteAbout: builder.mutation({
            query: (_id) => ({
                url: `/about/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["About"],
        }),
    }),
});

export const {
    useCreateAboutMutation,
    useGetAllAboutQuery,
    useGetAboutByIdQuery,
    useDeleteAboutMutation,
    useUpdateAboutMutation
} = AboutApi;
