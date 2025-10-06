import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const referralApi = createApi({
  reducerPath: "referralApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["ReferralList", "ReferralListItem"],
  endpoints: (builder) => ({
    getReferrals: builder.query({
      query: () => ({
        url: "/referral",
        method: "GET",
      }),
      providesTags: ["ReferralList"],
    }),

    getReferralsItem: builder.query({
      query: () => ({
        url: "/referral-item",
        method: "GET",
      }),
      providesTags: ["ReferralListItem"],
    }),
    getMappedReferrals: builder.query({
      query: (filter) => ({
        url: "/mapped-referral",
        method: "GET",
        params: filter,
      }),
      providesTags: ["ReferralList"],
    }),

    createReferral: builder.mutation({
      query: (newReferral) => ({
        url: "/create-referral",
        method: "POST",
        body: newReferral,
      }),
      invalidatesTags: ["ReferralList", "ReferralListItem"],
    }),
  }),
});

export const {
  useGetReferralsQuery,
  useGetReferralsItemQuery,
  useGetMappedReferralsQuery,
  useCreateReferralMutation,
} = referralApi;
