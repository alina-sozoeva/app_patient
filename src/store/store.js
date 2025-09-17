import { configureStore } from "@reduxjs/toolkit";
import { patientsApi } from "./patients";
import { pharmacyApi } from "./pharmacy";
import { doseApi } from "./dose";
import { drugApi } from "./drug";
import { drugFormApi } from "./drugForm";
import { frequencyApi } from "./frequency";
import { methodUseApi } from "./methodUse";
import { prescriptionApi } from "./prescription";
import { recipeItemApi } from "./recipeItem";
import { coursesApi } from "./courses";
import { userSlices } from "./slices";

export const store = configureStore({
  reducer: {
    [patientsApi.reducerPath]: patientsApi.reducer,
    [pharmacyApi.reducerPath]: pharmacyApi.reducer,
    [doseApi.reducerPath]: doseApi.reducer,
    [drugApi.reducerPath]: drugApi.reducer,
    [drugFormApi.reducerPath]: drugFormApi.reducer,
    [frequencyApi.reducerPath]: frequencyApi.reducer,
    [methodUseApi.reducerPath]: methodUseApi.reducer,
    [prescriptionApi.reducerPath]: prescriptionApi.reducer,
    [recipeItemApi.reducerPath]: recipeItemApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    user: userSlices.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      patientsApi.middleware,
      pharmacyApi.middleware,
      doseApi.middleware,
      drugApi.middleware,
      drugFormApi.middleware,
      frequencyApi.middleware,
      methodUseApi.middleware,
      prescriptionApi.middleware,
      recipeItemApi.middleware,
      coursesApi.middleware,
    ]),
});
