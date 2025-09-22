import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["PatientsList"],
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: (search) => ({
        url: "/patient",
        method: "GET",
        params: search,
      }),
      providesTags: ["PatientsList"],
    }),
    addPatient: builder.mutation({
      query: (newPatient) => ({
        url: "/patient",
        method: "POST",
        body: newPatient,
      }),
      invalidatesTags: ["PatientsList"],
    }),
    updatePatient: builder.mutation({
      query: (patient) => ({
        url: "/patient",
        method: "POST",
        body: patient,
      }),
      invalidatesTags: ["PatientsList"],
    }),
    addPatientWithPrescription: builder.mutation({
      query: (newPatient) => ({
        url: "/patientWithPrescription",
        method: "POST",
        body: newPatient,
      }),
      invalidatesTags: ["PatientsList"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useAddPatientWithPrescriptionMutation,
} = patientsApi;
