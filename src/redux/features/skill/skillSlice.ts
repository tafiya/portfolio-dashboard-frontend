import { baseApi } from "@/redux/api/baseApi";
import { TQueryParam, TResponseRedux } from "@/types/global";
import { TSkill } from "@/types/product";
;

const SkillApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSkill: builder.mutation({
            query: (formData) => ({
                url: "/skills",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Skill"],
        }),
        getAllSkill: builder.query({
            providesTags: ["Skill"],
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
                //params.append("limit", "100"); // Ensure fetching all Skills
                return {
                    url: `/skills`,
                    method: "GET",
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<TSkill[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
        }),
        getSkillById: builder.query({
            query: (id) => `/skills/${id}`,
            providesTags: ["Skill"],
        }),
        updateSkill: builder.mutation({
            query: ({ _id, updatedProduct }) => ({
                url: `/skills/${_id}`,
                method: "PATCH",
                body: updatedProduct,
            }),
            invalidatesTags: ["Skill"],
        }),
        deleteSkill: builder.mutation({
            query: (_id) => ({
                url: `/skills/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Skill"],
        }),
    }),
});

export const {
    useCreateSkillMutation,
    useGetAllSkillQuery,
    useGetSkillByIdQuery,
    useDeleteSkillMutation,
    useUpdateSkillMutation
} = SkillApi;
