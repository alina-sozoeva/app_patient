import { Empty, Flex, Input, Spin } from "antd";
import {
  DownOutlined,
  EnvironmentOutlined,
  PhoneFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import styles from "./NewReferralPage.module.scss";
import clsx from "clsx";

import { useGetClinicsQuery } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

export const NewReferralPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [rxsOpen, setRxsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedClinic, setSelectedClinic] = useState(
    () => JSON.parse(localStorage.getItem("selectedClinic")) || null
  );

  const toggleClinic = (clinic) => {
    const updated = selectedClinic?.codeid === clinic.codeid ? null : clinic;
    setSelectedClinic(updated);
    localStorage.setItem("selectedClinic", JSON.stringify(updated));
  };

  const {
    data: clinics,
    isLoading,
    isFetching,
  } = useGetClinicsQuery(search ? { search } : undefined);

  const sortedClinics = [...(clinics || [])].sort((a, b) =>
    a.nameid.localeCompare(b.nameid)
  );

  const displayedClinics = search ? sortedClinics : sortedClinics.slice(0, 10);

  return (
    <Spin spinning={isLoading || isFetching}>
      <main>
        <section className={clsx(styles.main, "container")}>
          <Flex
            className={clsx(styles.patient_header)}
            justify="space-between"
            align="center"
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Найти клинику"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Flex>

          <Flex
            className={clsx(styles.favorite_header)}
            justify="space-between"
          >
            <span>Клиники</span>
            <DownOutlined
              rotate={rxsOpen && 180}
              onClick={() => setRxsOpen(!rxsOpen)}
            />
          </Flex>

          {displayedClinics?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          {(rxsOpen || search !== "") && (
            <Flex vertical style={{ maxHeight: "400px", overflowY: "auto" }}>
              {displayedClinics?.map((clinic) => (
                <Flex
                  key={clinic.codeid}
                  vertical
                  className={clsx(
                    selectedClinic?.codeid === clinic.codeid &&
                      styles.item_check
                  )}
                  onClick={() => toggleClinic(clinic)}
                >
                  <Flex
                    className={clsx(styles.search)}
                    align="center"
                    justify="space-between"
                  >
                    <Flex vertical>
                      <span>
                        <b>{clinic?.nameid}</b>
                      </span>
                      <span>
                        <PhoneFilled /> {clinic?.phone}
                      </span>
                      <span>
                        <EnvironmentOutlined /> {clinic?.adress}
                      </span>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}

          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              disabled={!selectedClinic}
              className={clsx(
                !selectedClinic ? styles.create_btn_dis : styles.create_btn
              )}
              onClick={() =>
                navigate(`/referral-details/${guid}`, {
                  state: { selectedClinic },
                })
              }
            >
              {!selectedClinic ? <span>Выберите клинику</span> : "Далее"}
            </button>
          </div>
        </section>
      </main>
    </Spin>
  );
};
