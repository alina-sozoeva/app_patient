import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["ServicesList"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (search) => ({
        url: "/services",
        method: "GET",
        params: search,
      }),
      providesTags: ["ServicesList"],
    }),
  }),
});

export const { useGetServicesQuery } = servicesApi;
