import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addUser } from "../slices";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["DoctorList"],
  endpoints: (builder) => ({
    addDoctor: builder.mutation({
      query: (doc) => ({
        url: "/login-doctor",
        method: "POST",
        body: doc,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addUser(data?.data));
        } catch (err) {
          console.error("Login failed", err);
        }
      },
      invalidatesTags: ["DoctorList"],
    }),
  }),
});

export const { useAddDoctorMutation } = doctorApi;
