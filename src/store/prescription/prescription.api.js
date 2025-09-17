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
      invalidatesTags: ["PrescriptionList"],
    }),
  }),
});

export const {
  useGetPrescriptionQuery,
  useAddPrescriptionMutation,
  useAddPatientPrescriptionMutation,
} = prescriptionApi;
