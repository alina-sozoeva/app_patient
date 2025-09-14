import { Empty, Flex, Spin } from "antd";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patients } from "../../data";
import { AddPatientModal, PatientItem } from "../../components";

import clsx from "clsx";
import styles from "./PatientsPage.module.scss";
import { useGetPatientsQuery } from "../../store";

export const PatientsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useGetPatientsQuery();
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Spin spinning={isLoading || isFetching}>
      <main>
        <section className={clsx(styles.patient, "container")}>
          <Flex
            className={clsx(styles.patient_add, "container")}
            justify="space-between"
            align="center"
          >
            <span>Недавние пациенты</span>
            <button onClick={() => setOpenAdd(true)}>Добавить пациента</button>
          </Flex>

          {data?.length === 0 ? (
            <Empty />
          ) : (
            <Flex vertical style={{ maxHeight: "600px", overflowY: "auto" }}>
              {data?.map((item) => (
                <PatientItem
                  item={item}
                  onClick={() => navigate(`/patient/${item.guid}`)}
                />
              ))}
            </Flex>
          )}

          <AddPatientModal
            open={openAdd}
            onCancel={() => setOpenAdd(false)}
            title={"пациента"}
          />
        </section>
      </main>
    </Spin>
  );
};
