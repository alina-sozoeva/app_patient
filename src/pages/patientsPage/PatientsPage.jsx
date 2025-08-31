import { Flex } from "antd";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patients } from "../../data";
import { PatientItem } from "../../components";

import clsx from "clsx";
import styles from "./PatientsPage.module.scss";

export const PatientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState();

  const filteredArr = patients.filter((item) => item.fio === search);

  return (
    <main>
      <section className={clsx(styles.patient, "container")}>
        <Flex
          className={clsx(styles.patient_add, "container")}
          justify="space-between"
          align="center"
        >
          <span>Недавние пациенты</span>
          <button>Добавить пациента</button>
        </Flex>

        <Flex vertical>
          {patients.map((item) => (
            <PatientItem
              item={item}
              onClick={() => navigate(`/patient/${item.id}`)}
            />
          ))}
        </Flex>
      </section>
    </main>
  );
};
