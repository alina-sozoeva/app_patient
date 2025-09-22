import { Empty, Flex, Input, Spin } from "antd";

import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { SearchItem } from "../../components";

import styles from "./NewRxPage.module.scss";
import clsx from "clsx";

import { useGetDrugQuery } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

export const NewRxPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [rxsOpen, setRxsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState(
    () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
  );

  const {
    data: drugs,
    isLoading,
    isFetching,
  } = useGetDrugQuery(search ? { search } : undefined);

  const sortedDrugs = [...(drugs || [])].sort((a, b) =>
    a.nameid.localeCompare(b.nameid)
  );

  const toggleDrug = (drug) => {
    const exists = selectedDrugs?.find((d) => d.codeid === drug.codeid);
    let updated;

    if (exists) {
      updated = selectedDrugs?.filter((d) => d.codeid !== drug.codeid);
    } else {
      updated = [...selectedDrugs, drug];
    }

    setSelectedDrugs(updated);
    localStorage.setItem("selectedDrugs", JSON.stringify(updated));
  };

  const displayedDrugs = search ? sortedDrugs : sortedDrugs.slice(0, 10);

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
              placeholder="Найти новое лекарство"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Flex>

          <Flex
            className={clsx(styles.favorite_header)}
            justify="space-between"
          >
            <span>Медикаменты</span>
            <DownOutlined
              rotate={rxsOpen && 180}
              onClick={() => setRxsOpen(!rxsOpen)}
            />
          </Flex>

          {displayedDrugs?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          {(rxsOpen || search !== "") && (
            <Flex vertical style={{ maxHeight: "400px", overflowY: "auto" }}>
              {displayedDrugs?.map((item) => (
                <SearchItem
                  item={item}
                  selectedDrugs={selectedDrugs}
                  toggleDrug={toggleDrug}
                />
              ))}
            </Flex>
          )}
          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              disabled={selectedDrugs.length === 0}
              className={clsx(
                selectedDrugs.length === 0
                  ? styles.create_btn_dis
                  : styles.create_btn
              )}
              onClick={() => navigate(`/rx-details/${guid}`)}
            >
              {selectedDrugs.length === 0 ? (
                <span>Выберите медикамент</span>
              ) : (
                "Продолжить"
              )}
            </button>
          </div>
        </section>
      </main>
    </Spin>
  );
};
