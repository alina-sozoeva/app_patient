import { Empty, Flex, Spin } from "antd";

import { useState } from "react";
import { PrescriptionItem } from "../../components";
import { useGetMappedRecipesQuery } from "../../store";

import clsx from "clsx";
import styles from "./PrescriptionsPage.module.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";
dayjs.extend(utc);

const btns = [
  { title: "За сегодня", label: "today" },
  {
    title: "За вчера",
    label: "yesterday",
  },
  {
    title: "За 3 дня",
    label: "3days",
  },
  {
    title: "За неделю",
    label: "week",
  },
  {
    title: "За месяц",
    label: "month",
  },
];

export const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("today");

  const { data, isLoading, isFetching } = useGetMappedRecipesQuery(
    selectedFilter ? { filter: selectedFilter } : undefined
  );

  const nav = (codeid, guid) => {
    navigate(`/prescriptions-written/${codeid}/${guid}`);
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <main>
        <section className={clsx(styles.prescrip, "container")}>
          <Flex
            vertical
            className={clsx(styles.prescrip_add, "container")}
            justify="space-between"
            gap="small"
          >
            <Flex justify="space-between">
              {btns.map((item) => (
                <button
                  onClick={() => setSelectedFilter(item.label)}
                  style={{
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                  className={clsx(
                    item.label === selectedFilter
                      ? styles.prescrip_btn_active
                      : styles.prescrip_btn
                  )}
                >
                  {item.title}
                </button>
              ))}
            </Flex>
          </Flex>

          <Flex vertical style={{ maxHeight: "600px", overflowY: "auto" }}>
            {data?.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              data?.map((item) => (
                <PrescriptionItem item={item} onClick={nav} />
              ))
            )}
          </Flex>
        </section>
      </main>
    </Spin>
  );
};
