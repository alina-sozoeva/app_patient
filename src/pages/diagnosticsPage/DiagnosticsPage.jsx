import { Empty, Flex, Input, Spin } from "antd";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddPatientModal, PatientItem } from "../../components";

import clsx from "clsx";
import styles from "./DiagnosticsPage.module.scss";
import { useGetPatientsQuery } from "../../store";
import { SearchOutlined } from "@ant-design/icons";

export const DiagnosticsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const {
    data: patients,
    isLoading,
    isFetching,
  } = useGetPatientsQuery(search ? { search } : undefined);

  const filterPatients = useMemo(() => {
    const last10ByCodeid = [...(patients || [])]
      .sort((a, b) => b.codeid - a.codeid)
      .slice(0, 10);

    return last10ByCodeid;
  }, [patients]);

  const navPatient = (item) => {
    navigate(`/patient/${item.guid}`);
    localStorage.removeItem("selectedDrugs");
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <main>
        <section className={clsx(styles.patient, "container")}>
          <Flex
            className={clsx(styles.patient_add, "container")}
            justify="space-between"
            gap="small"
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Введите ФИО пациента"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setOpenAdd(true)}
              style={{
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              Добавить пациента
            </button>
          </Flex>

          {filterPatients?.length === 0 ? (
            <Empty />
          ) : (
            <Flex vertical style={{ maxHeight: "600px", overflowY: "auto" }}>
              {filterPatients?.map((item) => (
                <PatientItem item={item} />
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
