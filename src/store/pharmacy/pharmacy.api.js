import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pharmacyApi = createApi({
  reducerPath: "pharmacyApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["PharmacyList"],
  endpoints: (builder) => ({
    getPharmacy: builder.query({
      query: () => ({
        url: "/pharmacy",
        method: "GET",
      }),
      providesTags: ["PharmacyList"],
    }),
    addPharmacy: builder.mutation({
      query: (newPharmacy) => ({
        url: "/pharmacy",
        method: "POST",
        body: newPharmacy,
      }),
      invalidatesTags: ["PharmacyList"],
    }),
    updatePharmacy: builder.mutation({
      query: (pharmacy) => ({
        url: "/pharmacy",
        method: "POST",
        body: pharmacy,
      }),
      invalidatesTags: ["PharmacyList"],
    }),
  }),
});

export const {
  useGetPharmacyQuery,
  useAddPharmacyMutation,
  useUpdatePharmacyMutation,
} = pharmacyApi;
