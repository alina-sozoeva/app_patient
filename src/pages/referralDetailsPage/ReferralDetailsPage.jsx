import { Empty, Flex, Input, Spin } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./ReferralDetailsPage.module.scss";
import clsx from "clsx";

import {
  useCreateReferralMutation,
  useGetPatientsQuery,
  useGetServicesQuery,
} from "../../store";
import { useNavigate, useParams } from "react-router-dom";

export const ReferralDetailsPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [rxsOpen, setRxsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedServices, setSelectedServices] = useState([]);
  const { data: patients } = useGetPatientsQuery();

  const [add] = useCreateReferralMutation();
  const selectedClinic =
    JSON.parse(localStorage.getItem("selectedClinic")) || [];

  const toggleService = (service) => {
    const exists = selectedServices.some((s) => s.codeid === service.codeid);
    let updated;

    if (exists) {
      updated = selectedServices.filter((s) => s.codeid !== service.codeid);
    } else {
      updated = [...selectedServices, service];
    }

    setSelectedServices(updated);
  };

  const {
    data: services,
    isLoading,
    isFetching,
  } = useGetServicesQuery(search ? { search } : undefined);

  const sortedServices = [...(services || [])].sort((a, b) =>
    a.nameid.localeCompare(b.nameid)
  );

  const findPatient = patients?.find((item) => item.guid === guid);

  const displayedServices = search
    ? sortedServices
    : sortedServices.slice(0, 10);

  const onFinish = async () => {
    // Массив только чисел
    const serviceIds = selectedServices
      .map((item) => item.codeid)
      .filter(Boolean);

    await add({
      services: serviceIds,
      doctorCode: 123,
      patientCode: findPatient?.codeid,
      clinicCode: selectedClinic?.codeid,
    }).unwrap();

    localStorage.removeItem("selectedClinic");

    navigate(`/diagnostics/${guid}`);
    window.location.reload();
  };

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
              placeholder="Найти услугу"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Flex>

          <Flex
            className={clsx(styles.favorite_header)}
            justify="space-between"
          >
            <span>Услуги</span>
            <DownOutlined
              rotate={rxsOpen && 180}
              onClick={() => setRxsOpen(!rxsOpen)}
            />
          </Flex>

          {displayedServices?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          {(rxsOpen || search !== "") && (
            <Flex vertical style={{ maxHeight: "400px", overflowY: "auto" }}>
              {displayedServices?.map((item) => (
                <Flex
                  key={item.codeid}
                  vertical
                  className={clsx(
                    selectedServices.some((s) => s.codeid === item.codeid) &&
                      styles.item_check
                  )}
                  onClick={() => toggleService(item)}
                >
                  <Flex
                    className={clsx(styles.search)}
                    align="center"
                    justify="space-between"
                  >
                    <Flex vertical>
                      <span>
                        <b>{item?.nameid}</b>
                      </span>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}

          <div className={clsx(styles.create_btn_wrap, "container w-full ")}>
            <button
              disabled={selectedServices.length === 0}
              className={clsx(
                selectedServices.length === 0
                  ? styles.create_btn_dis
                  : styles.create_btn
              )}
              onClick={onFinish}
            >
              {selectedServices.length === 0 ? (
                <span>Выберите одну или несколько услуг</span>
              ) : (
                "Создать направление"
              )}
            </button>
          </div>
        </section>
      </main>
    </Spin>
  );
};
