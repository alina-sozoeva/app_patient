import { useMemo } from "react";

export const useMappedRecipes = ({
  groupedRecipes,
  findRecipe,
  drugs,
  doses,
  methodUse,
  courses,
  frequency,
  doctors, // добавляем сюда
}) => {
  return useMemo(() => {
    if (!groupedRecipes) return [];

    const doctorsMap = doctors?.reduce((acc, doc) => {
      acc[doc.codeid] = doc;
      return acc;
    }, {});

    return Object.entries(groupedRecipes)
      .sort((a, b) => +b[0] - +a[0])
      .map(([prescription_codeid, items]) => {
        const recipeData = findRecipe?.find(
          (r) => +r.codeid === +prescription_codeid
        );

        const doctor = doctorsMap[recipeData?.doctor_codeid];

        return {
          prescription_codeid,
          created_at: recipeData?.created_at,
          status: recipeData?.status,
          doctorName: doctor?.nameid || "-",
          doctorPhone: doctor?.phone || "-",
          items: items.map((item) => {
            const drug = drugs?.find((d) => d.codeid === +item.drug_codeid);
            const dose = doses?.find((d) => d.codeid === +item.dose_codeid);
            const method = methodUse?.find(
              (m) => m.codeid === +item.method_use_codeid
            );
            const course = courses?.find(
              (c) => c.codeid === +item.course_codeid
            );
            const freq = frequency?.find(
              (f) => f.codeid === +item.frequency_codeid
            );

            return {
              ...item,
              drugName: drug?.nameid || "",
              doseName: dose?.nameid || "",
              methodName: method?.nameid || "",
              courseName: course?.count_days || "",
              frequencyName: freq?.times_per_day
                ? `${freq.times_per_day} раза в день по ${
                    freq.quantity_per_time || 1
                  } таблетке`
                : "",
            };
          }),
        };
      });
  }, [
    groupedRecipes,
    findRecipe,
    drugs,
    doses,
    methodUse,
    courses,
    frequency,
    doctors, // добавляем сюда
  ]);
};
