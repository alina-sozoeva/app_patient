import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const drugFormApi = createApi({
  reducerPath: "drugFormApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["DrugFormList"],
  endpoints: (builder) => ({
    getDrugForm: builder.query({
      query: () => ({
        url: "/drug-form",
        method: "GET",
      }),
      providesTags: ["DrugFormList"],
    }),
    addDrugForm: builder.mutation({
      query: (newDrugForm) => ({
        url: "/drug-form",
        method: "POST",
        body: newDrugForm,
      }),
      invalidatesTags: ["DrugFormList"],
    }),
  }),
});

export const { useGetDrugFormQuery, useAddDrugFormMutation } = drugFormApi;
