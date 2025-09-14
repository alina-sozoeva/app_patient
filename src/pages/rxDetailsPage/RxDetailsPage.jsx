import { useState } from "react";
import { Flex, Input } from "antd";
import styles from "./RxDetailsPage.module.scss";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { gender } from "../../enums";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import {
  useAddPrescriptionMutation,
  useAddRecipeItemMutation,
  useGetDoseQuery,
  useGetDrugQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
} from "../../store";

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

  const [dosesOpen, setDosesOpen] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedReception, setSelectedReception] = useState(null);
  const [selectedDose, setSelectedDose] = useState(null);
  const [addPrescription] = useAddPrescriptionMutation();
  const [addRecipeItem] = useAddRecipeItemMutation();

  const findPatient = patients?.find((item) => item.guid === guid);
  const findRx = drugs?.find((item) => item?.codeid === +drug_id);
  const findDose = doses?.find((item) => item?.codeid === +dose_id);

  console.log(selectedQuantity, selectedReception, selectedDose);

  const onFinish = () => {
    addRecipeItem({
      prescription_codeid: "",
      drug_codeid: findRx?.codeid,
      form_name: findRx?.form_name,
      dose_nameid: findDose?.nameid,
      method_use_nameid: methodUse?.[0]?.nameid,
      course_nameid: "7 дней",
      frequency_nameid: "3 раза в день",
      time_before_food: "0",
      time_during_food: "0",
      time_after_food: "1",
    });
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
                  selectedDose === item.codeid && styles.item_active
                )}
                justify="space-between"
                onClick={() => setSelectedDose(item.codeid)}
              >
                <span>
                  {item?.times_per_day} раза в день по {item?.quantity_per_time}{" "}
                  таблетке
                </span>
                <RightOutlined
                  style={{
                    color: selectedDose === item.id ? "gold" : "inherit",
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
          <Input placeholder="Введите кол-во дней" />
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
                [styles.active]: selectedReception === item,
              })}
              onClick={() => setSelectedReception(item)}
            >
              {item}
            </button>
          ))}
        </Flex>

        <div className={clsx(styles.create_btn_wrap, "container w-full")}>
          <button
            className={clsx(styles.create_btn)}
            onClick={() => navigate(`/patient/${guid}`)}
          >
            Продолжить
          </button>
        </div>
      </section>
    </main>
  );
};
