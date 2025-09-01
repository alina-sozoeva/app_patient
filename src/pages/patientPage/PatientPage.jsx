import { useNavigate, useParams } from "react-router-dom";
import { medications, patients, pharmacies } from "../../data";
import { Flex } from "antd";

import styles from "./PatientPage.module.scss";
import clsx from "clsx";
import { DownOutlined, PhoneFilled } from "@ant-design/icons";
import { gender, pathname } from "../../enums";
import { useState } from "react";
import { MedHistoryItem } from "../../components";

export const PatientPage = () => {
  const { id } = useParams();
  const [dopInfo, setDopInfo] = useState(false);
  const navigate = useNavigate();

  const findPatient = patients.find((item) => item.id === +id);

  const findPhar = pharmacies.find(
    (item) => item.id === findPatient.pharmacy_id
  );

  const filterMed = medications.filter((item) => item.patient_id === +id);

  console.log(filterMed, "filterMed");

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
        </Flex>

        <Flex vertical className={clsx(styles.patient_about)}>
          <Flex justify="space-between">
            <Flex vertical>
              <Flex gap="small" className={clsx(styles.patient_info)}>
                <span className={clsx(styles.patient_info_fio)}>
                  {findPatient.fio}
                </span>
                <span className={clsx(styles.patient_info_bday)}>
                  ({findPatient.birthday})
                </span>
              </Flex>
              <span className={clsx(styles.patient_info_gender)}>
                {gender[findPatient.gender]}
              </span>
            </Flex>

            <span className={clsx(styles.act_btn)}>Редактировать</span>
          </Flex>

          {dopInfo && (
            <Flex justify="space-between" className={clsx("pt-4")}>
              <Flex vertical>
                <span className={clsx(styles.title)}>Аптека</span>
                <span>{findPhar.name}</span>
                <span style={{ maxWidth: "160px" }}>{findPhar.address}</span>
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
        <Flex vertical>
          {filterMed.map((item) => (
            <MedHistoryItem item={item} />
          ))}
        </Flex>
      </section>
      <div className={clsx(styles.create_btn_wrap, "relative w-full")}>
        <button
          className={clsx(styles.create_btn)}
          onClick={() => navigate(pathname.newRx)}
        >
          Создать рецепт
        </button>
      </div>
    </main>
  );
};
