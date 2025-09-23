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
    getMappedRecipes: builder.query({
      query: (filter) => ({
        url: "/mapped-recipes",
        method: "GET",
        params: filter,
      }),
      providesTags: ["PrescriptionList"],
    }),
    getMonthlyPrescriptionReport: builder.query({
      query: () => ({
        url: "/monthly-prescription-report",
        method: "GET",
      }),
      providesTags: ["PrescriptionList"],
    }),
    getMonthlyDrugReport: builder.query({
      query: () => ({
        url: "/monthly-grug-report",
        method: "GET",
      }),
      providesTags: ["PrescriptionList"],
    }),
    addPatientPrescription: builder.mutation({
      query: (newPrescription) => ({
        url: "/patientWithPrescription",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["PrescriptionList"],
    }),
  }),
});

export const {
  useGetPrescriptionQuery,
  useAddPatientPrescriptionMutation,
  useGetMappedRecipesQuery,
  useGetMonthlyPrescriptionReportQuery,
  useGetMonthlyDrugReportQuery,
} = prescriptionApi;
