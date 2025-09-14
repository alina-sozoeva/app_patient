import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const recipeItemApi = createApi({
  reducerPath: "recipeItemApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MAIN_URL }),
  tagTypes: ["RecipeItemList"],
  endpoints: (builder) => ({
    getRecipeItem: builder.query({
      query: (prescriptionId) => ({
        url: `/recipe-item?prescriptionId=${prescriptionId}`,
        method: "GET",
      }),
      providesTags: ["RecipeItemList"],
    }),
    addRecipeItem: builder.mutation({
      query: (newRecipeItem) => ({
        url: "/recipe-item",
        method: "POST",
        body: newRecipeItem,
      }),
      invalidatesTags: ["RecipeItemList"],
    }),
  }),
});

export const { useGetRecipeItemQuery, useAddRecipeItemMutation } =
  recipeItemApi;
