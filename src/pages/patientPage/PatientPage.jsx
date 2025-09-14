import { useNavigate, useParams } from "react-router-dom";

import { Empty, Flex, Spin } from "antd";

import { DownOutlined, PhoneFilled } from "@ant-design/icons";
import { gender } from "../../enums";
import { useState } from "react";
import { EditPatientModal, MedHistoryItem } from "../../components";

import {
  useGetCoursesQuery,
  useGetDoseQuery,
  useGetDrugQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
  useGetPrescriptionQuery,
  useGetRecipeItemQuery,
  useGetRecipeQuery,
} from "../../store";

import styles from "./PatientPage.module.scss";
import clsx from "clsx";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useGetPharmacyQuery } from "../../store/pharmacy/pharmacy.api";
dayjs.locale("ru");

export const PatientPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [dopInfo, setDopInfo] = useState(false);

  const { data: patients, isLoading, isFetching } = useGetPatientsQuery();
  const { data: pharmacy } = useGetPharmacyQuery();
  const { data: recipe } = useGetRecipeQuery();
  const { data: recipeItem } = useGetRecipeItemQuery();
  const { data: doses } = useGetDoseQuery();
  const { data: drugs } = useGetDrugQuery();
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();

  const findPatient = patients?.find((item) => item?.guid === guid);

  const findRecipe = recipe?.filter(
    (item) => +item?.patient_codeid === +findPatient?.codeid
  );

  const mappedRecipes = recipeItem?.filter((item) =>
    findRecipe?.some((presc) => presc?.codeid === item?.prescription_codeid)
  );

  const mappedRecipesWithNames = mappedRecipes?.map((item) => {
    const drug = drugs?.find((d) => d.codeid === +item.drug_codeid);
    const dose = doses?.find((d) => d.codeid === +item.dose_codeid);
    const method = methodUse?.find((m) => m.codeid === +item.method_use_codeid);
    const course = courses?.find((c) => c.codeid === +item.course_codeid);
    const freq = frequency?.find((f) => f.codeid === +item.frequency_codeid);

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
  });

  console.log(mappedRecipesWithNames, "mappedRecipesWithNames");

  const pharmacyItem = pharmacy?.[0];

  return (
    <Spin spinning={isLoading || isFetching}>
      <main className={clsx(styles.patient, "relative")}>
        <section className={clsx("container relative")}>
          <Flex
            className={clsx(styles.patient_header)}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Профиль</span>
            <button>
              Позвонить <PhoneFilled />
            </button>
          </Flex>

          <Flex vertical className={clsx(styles.patient_about)}>
            <Flex justify="space-between">
              <Flex vertical>
                <Flex gap="small" className={clsx(styles.patient_info)}>
                  <span className={clsx(styles.patient_info_fio)}>
                    {findPatient?.fio}
                  </span>
                  <span className={clsx(styles.patient_info_bday)}>
                    {dayjs(findPatient?.birth_date).format("D MMMM YYYY г.")}
                  </span>
                </Flex>
                <span className={clsx(styles.patient_info_gender)}>
                  {gender[findPatient?.gender]}
                </span>
              </Flex>

              <span
                className={clsx(styles.act_btn)}
                onClick={() => setOpenUpdate(true)}
              >
                Редактировать
              </span>
            </Flex>

            {dopInfo && (
              <Flex justify="space-between" className={clsx("pt-4")}>
                <Flex vertical>
                  <span className={clsx(styles.title)}>Аптека</span>
                  <span>{pharmacyItem?.nameid}</span>
                  <span style={{ maxWidth: "160px" }}>
                    {pharmacyItem?.address}
                  </span>
                </Flex>
                <span className={clsx(styles.act_btn)}>Изменить</span>
              </Flex>
            )}
            <div
              className={clsx(styles.dop_arr)}
              onClick={() => setDopInfo(!dopInfo)}
            >
              <DownOutlined rotate={dopInfo && 180} />
            </div>
          </Flex>

          <Flex
            className={clsx(styles.patient_header, "container")}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Активные метикаменты</span>
            {/* <span className={clsx(styles.act_btn)}>Изменить</span> */}
          </Flex>
        </section>

        <section className={clsx("container")}>
          <div className={clsx(styles.active_med)}>
            <Flex
              className={clsx(styles.active_med_title)}
              justify="space-between"
            >
              <span>Медициская история</span>
              <span className={clsx(styles.act_btn)}>Вытащить запись</span>
            </Flex>
          </div>
          {mappedRecipesWithNames?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          <Flex vertical style={{ maxHeight: "400px", overflowY: "auto" }}>
            {mappedRecipesWithNames?.map((item) => (
              <MedHistoryItem item={item} />
            ))}
          </Flex>
          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn)}
              onClick={() => navigate(`/new-rx/${guid}`)}
            >
              Создать рецепт
            </button>
          </div>
        </section>
        <EditPatientModal
          open={openUpdate}
          onCancel={() => setOpenUpdate(false)}
          item={findPatient}
          title={"пациента"}
        />
      </main>
    </Spin>
  );
};
