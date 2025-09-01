import { useState } from "react";
import { Flex } from "antd";
import styles from "./RxDetailsPage.module.scss";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { doses, patients, rxs } from "../../data";
import { gender } from "../../enums";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

const days = ["7", "10", "14", "30", "90", "другое"];
const quantity = ["4", "8", "24", "28", "30", "другое"];
const reception = ["0", "1", "3", "5", "PRN", "другое"];

export const RxDetailsPage = () => {
  const { id, doseId } = useParams();
  const navigate = useNavigate();
  const [dosesOpen, setDosesOpen] = useState(true);

  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedReception, setSelectedReception] = useState(null);
  const [selectedDose, setSelectedDose] = useState(null);

  const findPatient = patients.find((item) => item.id === +id);
  const findRx = rxs.find((item) => item.id === +doseId);

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
              ({findPatient?.birthday})
            </span>
          </Flex>
          <span className={clsx(styles.patient_info_gender)}>
            {gender[findPatient?.gender || 0]}
          </span>
        </Flex>

        <Flex vertical className={clsx(styles.patient_rx)}>
          <span>
            <b>{findRx?.name}</b>
          </span>
          <span>
            {findRx?.strength[0]} {findRx?.form}
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
            {doses.map((item) => (
              <Flex
                key={item.id}
                className={clsx(
                  styles.item,
                  selectedDose === item.id && styles.item_active
                )}
                justify="space-between"
                onClick={() => setSelectedDose(item.id)}
              >
                <span>{item.description}</span>
                <RightOutlined
                  style={{
                    color: selectedDose === item.id ? "gold" : "inherit",
                  }}
                />
              </Flex>
            ))}
          </Flex>
        )}

        {/* Количество таблеток */}
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
          {days.map((item) => (
            <button
              key={item}
              className={clsx(styles.btn, {
                [styles.active]: selectedDays === item,
              })}
              onClick={() => setSelectedDays(item)}
            >
              {item}
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
                [styles.active]: selectedReception === item,
              })}
              onClick={() => setSelectedReception(item)}
            >
              {item}
            </button>
          ))}
        </Flex>

        {/* <Flex className={clsx(styles.btn_con)} align="center" justify="center">
          <button className={clsx(styles.btn_con_chil)}>Заменить</button>
          <button className={clsx(styles.btn_con_chil)}>Выдать </button>
        </Flex> */}
      </section>
      <div className={clsx(styles.create_btn_wrap, " w-full")}>
        <button
          className={clsx(styles.create_btn)}
          onClick={() => navigate(`/patient/${id}`)}
        >
          Продолжить
        </button>
      </div>
    </main>
  );
};
