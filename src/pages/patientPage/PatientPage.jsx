import { useNavigate, useParams } from "react-router-dom";
import { medications, pharmacies } from "../../data";
import { Empty, Flex } from "antd";

import { DownOutlined, PhoneFilled } from "@ant-design/icons";
import { gender } from "../../enums";
import { useState } from "react";
import { MedHistoryItem } from "../../components";

import {
  useAddDoseMutation,
  useGetDoseQuery,
  useGetPatientsQuery,
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

  const { data: doses } = useGetDoseQuery();
  const { data: patients, isLoading } = useGetPatientsQuery();
  const { data: pharmacy } = useGetPharmacyQuery();

  const [dopInfo, setDopInfo] = useState(false);
  const [addDose] = useAddDoseMutation();

  const pharmacyItem = pharmacy?.[0];

  const findPatient = patients?.find((item) => item?.guid === guid);

  const findPhar = pharmacies?.find(
    (item) => item.id === findPatient?.pharmacy_id
  );

  const filterMed = medications?.filter((item) => item?.patient_id === guid);

  const onAddDose = () => {
    addDose({
      nameid: "500 мг",
    });
  };

  return (
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
          <button onClick={() => onAddDose()}>dose</button>
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

            <span className={clsx(styles.act_btn)}>Редактировать</span>
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
          <span className={clsx(styles.act_btn)}>Изменить</span>
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
        {filterMed.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <Flex vertical>
          {filterMed.map((item) => (
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
    </main>
  );
};
