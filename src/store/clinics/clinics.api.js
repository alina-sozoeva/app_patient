import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clinicsApi = createApi({
  reducerPath: "clinicsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["ClinicsList"],
  endpoints: (builder) => ({
    getClinics: builder.query({
      query: (search) => ({
        url: "/clinics",
        method: "GET",
        params: search,
      }),
      providesTags: ["ClinicsList"],
    }),
  }),
});

export const { useGetClinicsQuery } = clinicsApi;
