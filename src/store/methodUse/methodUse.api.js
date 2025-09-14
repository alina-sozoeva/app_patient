import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const methodUseApi = createApi({
  reducerPath: "methodUseApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["MethodUseList"],
  endpoints: (builder) => ({
    getMethodUse: builder.query({
      query: () => ({
        url: "/method-use",
        method: "GET",
      }),
      providesTags: ["MethodUseList"],
    }),
    addMethodUse: builder.mutation({
      query: (newMethodUse) => ({
        url: "/method-use",
        method: "POST",
        body: newMethodUse,
      }),
      invalidatesTags: ["MethodUseList"],
    }),
  }),
});

export const { useGetMethodUseQuery, useAddMethodUseMutation } = methodUseApi;
