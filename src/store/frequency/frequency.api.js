import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const frequencyApi = createApi({
  reducerPath: "frequencyApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["FrequencyList"],
  endpoints: (builder) => ({
    getFrequency: builder.query({
      query: () => ({
        url: "/frequency",
        method: "GET",
      }),
      providesTags: ["FrequencyList"],
    }),
    addFrequency: builder.mutation({
      query: (newFrequency) => ({
        url: "/frequency",
        method: "POST",
        body: newFrequency,
      }),
      invalidatesTags: ["FrequencyList"],
    }),
  }),
});

export const { useGetFrequencyQuery, useAddFrequencyMutation } = frequencyApi;
