import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["PatientsList"],
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => ({
        url: "/patient",
        method: "GET",
      }),
      providesTags: ["PatientsList"],
    }),
    addPatient: builder.mutation({
      query: (newPatient) => ({
        url: "/patient",
        method: "POST",
        body: newPatient,
      }),
    }),
  }),
});

export const { useGetPatientsQuery, useAddPatientMutation } = patientsApi;
