import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["CoursesList"],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
      providesTags: ["CoursesList"],
    }),
  }),
});

export const { useGetCoursesQuery } = coursesApi;
