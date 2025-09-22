import { Flex, Spin } from "antd";

import { useState } from "react";
import { PrescriptionItem } from "../../components";
import { useGetRecipeQuery } from "../../store";

import clsx from "clsx";
import styles from "./PrescriptionsPage.module.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const btns = [
  { title: "За сегодня", filterFn: (d) => dayjs(d).isSame(dayjs(), "day") },
  {
    title: "За вчера",
    filterFn: (d) => dayjs(d).isSame(dayjs().subtract(1, "day"), "day"),
  },
  {
    title: "За 3 дня",
    filterFn: (d) => dayjs(d).isAfter(dayjs().subtract(3, "day")),
  },
  {
    title: "За неделю",
    filterFn: (d) => dayjs(d).isAfter(dayjs().subtract(7, "day")),
  },
  {
    title: "За месяц",
    filterFn: (d) => dayjs(d).isAfter(dayjs().subtract(1, "month")),
  },
];

export const PrescriptionsPage = () => {
  const { data: recipe, isLoading, isFetching } = useGetRecipeQuery();

  const [selectedFilter, setSelectedFilter] = useState(btns[0]);

  const filteredRecipes = recipe?.filter((r) =>
    selectedFilter?.filterFn(r.created_at)
  );
  console.log(selectedFilter, "selectedFilter");

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
                  onClick={() => setSelectedFilter(item)}
                  style={{
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                  className={clsx(
                    item === selectedFilter
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
            {filteredRecipes?.map((item) => (
              <PrescriptionItem item={item} />
            ))}
          </Flex>
        </section>
      </main>
    </Spin>
  );
};
