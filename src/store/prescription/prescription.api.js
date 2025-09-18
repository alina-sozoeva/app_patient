import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const prescriptionApi = createApi({
  reducerPath: "prescriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: [
    "PrescriptionList",
    "RecipeItemList",
    "RecipeList",
    "PatientsList",
  ],
  endpoints: (builder) => ({
    getPrescription: builder.query({
      query: () => ({
        url: "/prescription",
        method: "GET",
      }),
      providesTags: ["PrescriptionList"],
    }),
    getPatients: builder.query({
      query: () => ({
        url: "/patient",
        method: "GET",
      }),
      providesTags: ["PatientsList"],
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
    // addPrescription: builder.mutation({
    //   query: (newPrescription) => ({
    //     url: "/prescription",
    //     method: "POST",
    //     body: newPrescription,
    //   }),
    //   invalidatesTags: ["PrescriptionList"],
    // }),
    addPatientPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: "/patientWithPrescription",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: (result, error, newPrescription) => [
        { type: "RecipeList", id: `LIST-${newPrescription.patient.guid}` },
      ],
    }),
  }),
});

export const {
  useGetPrescriptionQuery,
  useAddPrescriptionMutation,
  useAddPatientPrescriptionMutation,
} = prescriptionApi;
