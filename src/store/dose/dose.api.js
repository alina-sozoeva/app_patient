import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const doseApi = createApi({
  reducerPath: "doseApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["DoseList"],
  endpoints: (builder) => ({
    getDose: builder.query({
      query: () => ({
        url: "/dose",
        method: "GET",
      }),
      providesTags: ["DoseList"],
    }),
    addDose: builder.mutation({
      query: (newDose) => ({
        url: "/dose",
        method: "POST",
        body: newDose,
      }),
      invalidatesTags: ["DoseList"],
    }),
  }),
});

export const { useGetDoseQuery, useAddDoseMutation } = doseApi;
