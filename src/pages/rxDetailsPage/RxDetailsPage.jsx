import { useState } from "react";
import { Flex, Input } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { gender } from "../../enums";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import {
  useAddPrescriptionMutation,
  useAddRecipeItemMutation,
  useGetCoursesQuery,
  useGetDoseQuery,
  useGetDrugQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
} from "../../store";

import styles from "./RxDetailsPage.module.scss";
import clsx from "clsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";

dayjs.extend(utc);
dayjs.locale("ru");

const quantity = ["4", "8", "24", "28", "30", "другое"];
const reception = ["до еды", "во время еды", "после еды"];

export const RxDetailsPage = () => {
  const { guid, dose_id, drug_id } = useParams();
  const navigate = useNavigate();

  const { data: patients } = useGetPatientsQuery();
  const { data: doses } = useGetDoseQuery();
  const { data: drugs } = useGetDrugQuery();
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();

  console.log(courses, "courses");

  const [dosesOpen, setDosesOpen] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [addPrescription] = useAddPrescriptionMutation();
  const [addRecipeItem] = useAddRecipeItemMutation();

  const findPatient = patients?.find((item) => item.guid === guid);
  const findRx = drugs?.find((item) => item?.codeid === +drug_id);
  const findDose = doses?.find((item) => item?.codeid === +dose_id);

  const onFinish = async () => {
    const result = await addPrescription({
      doctorCode: 123,
      patient_codeid: +findPatient?.codeid,
    }).unwrap();

    const prescriptionId = +result?.result?.[0]?.prescription_id;

    await addRecipeItem({
      prescriptionId: prescriptionId,
      drugId: findRx?.codeid,
      formName: findRx?.form_name,
      dose: findDose?.codeid,
      method: methodUse?.[0]?.codeid,
      course: selectedCourses,
      frequency: selectedFrequency,
      before: selectedTime === "до еды" ? 1 : 0,
      during: selectedTime === "во время еды" ? 1 : 0,
      after: selectedTime === "после еды" ? 1 : 0,
    });

    setSelectedTime(null);
    setSelectedFrequency(null);
    setSelectedQuantity(null);
    setSelectedCourses(null);

    navigate(`/patient/${guid}`);
  };

  return (
    <main className={clsx(" relative")}>
      <section className={clsx("container ")}>
        <Flex
          className={clsx(styles.patient_wrap)}
          justify="space-between"
          vertical
        >
          <Flex gap="small" className={clsx(styles.patient_info)}>
            <span className={clsx(styles.patient_info_fio)}>
              <b>{findPatient?.fio}</b>
            </span>
            <span className={clsx(styles.patient_info_bday)}>
              {dayjs.utc(findPatient?.birth_date).format("D MMMM YYYY г.")}
            </span>
          </Flex>
          <span className={clsx(styles.patient_info_gender)}>
            {gender[findPatient?.gender || 0]}
          </span>
          {/* <button onClick={() => onFinish()}>add</button> */}
        </Flex>

        <Flex vertical className={clsx(styles.patient_rx)}>
          <span>
            <b>{findRx?.nameid}</b>
          </span>
          <span>
            {findDose?.nameid} {findRx?.form_name}
          </span>

          <span style={{ color: "var(--blue-color)" }}>
            <b>u</b>
          </span>
        </Flex>

        <Flex className={clsx(styles.patient_wrap)} justify="space-between">
          <span className={clsx(styles.patient_info_fio)}>
            <b>Продолжительность</b>
          </span>
          <DownOutlined onClick={() => setDosesOpen(!dosesOpen)} />
        </Flex>
        {dosesOpen && (
          <Flex vertical>
            {frequency?.map((item) => (
              <Flex
                key={item.codeid}
                className={clsx(
                  styles.item,
                  selectedFrequency === item.codeid && styles.item_active
                )}
                justify="space-between"
                onClick={() => setSelectedFrequency(item.codeid)}
              >
                <span>
                  {item?.times_per_day} раза в день по {item?.quantity_per_time}{" "}
                  таблетке
                </span>
                <RightOutlined
                  style={{
                    color:
                      selectedFrequency === item.codeid ? "gold" : "inherit",
                  }}
                />
              </Flex>
            ))}
          </Flex>
        )}

        <Flex className={clsx(styles.patient_wrap)} justify="space-between">
          <span className={clsx(styles.patient_info_fio)}>
            <b>Количество таблеток</b>
          </span>
        </Flex>
        <Flex className={clsx(styles.btns)} justify="space-between">
          {quantity.map((item) => (
            <button
              key={item}
              className={clsx(styles.btn, {
                [styles.active]: selectedQuantity === item,
              })}
              onClick={() => setSelectedQuantity(item)}
            >
              {item}
            </button>
          ))}
        </Flex>

        <Flex className={clsx(styles.patient_wrap)} justify="space-between">
          <span className={clsx(styles.patient_info_fio)}>
            <b>Количество дней</b>
          </span>
        </Flex>

        <Flex className={clsx(styles.btns)} justify="space-between">
          {courses?.map((item) => (
            <button
              key={item?.codeid}
              className={clsx(styles.btn, {
                [styles.active]: selectedCourses === item?.codeid,
              })}
              onClick={() => setSelectedCourses(item?.codeid)}
            >
              {item?.count_days}
            </button>
          ))}
        </Flex>

        <Flex className={clsx(styles.patient_wrap)} justify="space-between">
          <span className={clsx(styles.patient_info_fio)}>
            <b>Прием</b>
          </span>
        </Flex>
        <Flex className={clsx(styles.btns, "mb-2")} justify="space-between">
          {reception.map((item) => (
            <button
              key={item}
              className={clsx(styles.btn, {
                [styles.active]: setSelectedTime === item,
              })}
              onClick={() => setSelectedTime(item)}
            >
              {item}
            </button>
          ))}
        </Flex>

        <div className={clsx(styles.create_btn_wrap, "container w-full")}>
          <button
            className={clsx(styles.create_btn)}
            onClick={() => onFinish()}
          >
            Продолжить
          </button>
        </div>
      </section>
    </main>
  );
};
