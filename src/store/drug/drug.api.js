import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const drugApi = createApi({
  reducerPath: "drugApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["DrugList"],
  endpoints: (builder) => ({
    getDrug: builder.query({
      query: (search) => ({
        url: "/drug",
        method: "GET",
        params: search,
      }),
      providesTags: ["DrugList"],
    }),
    addDrug: builder.mutation({
      query: (newDrug) => ({
        url: "/drug",
        method: "POST",
        body: newDrug,
      }),
      invalidatesTags: ["DrugList"],
    }),
  }),
});

export const { useGetDrugQuery, useAddDrugMutation } = drugApi;
