import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const prescriptionApi = createApi({
  reducerPath: "prescriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["PrescriptionList"],
  endpoints: (builder) => ({
    getPrescription: builder.query({
      query: () => ({
        url: "/prescription",
        method: "GET",
      }),
      providesTags: ["PrescriptionList"],
    }),
    getRecipe: builder.query({
      query: (patientId) => ({
        url: "/recipe",
        method: "GET",
        params: patientId,
      }),
      providesTags: ["RecipeList"],
    }),
    getRecipeItem: builder.query({
      query: (prescriptionId) => ({
        url: `/recipe-item?prescriptionId=${prescriptionId}`,
        method: "GET",
      }),
      providesTags: ["RecipeItemList"],
    }),
    addPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: "/prescription",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["PrescriptionList"],
    }),
    addPatientPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: "/patientWithPrescription",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["PrescriptionList", "RecipeItemList", "RecipeList"],
    }),
  }),
});

export const {
  useGetPrescriptionQuery,
  useAddPrescriptionMutation,
  useAddPatientPrescriptionMutation,
} = prescriptionApi;
