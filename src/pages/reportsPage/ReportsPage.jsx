import { useNavigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";
import { useState } from "react";
import {
  useGetMonthlyDrugReportQuery,
  useGetMonthlyPrescriptionReportQuery,
} from "../../store";
import styles from "./ReportsPage.module.scss";

dayjs.locale("ru");
dayjs.extend(utc);

const btns = [
  { title: "По рецептам", label: "recipe" },
  { title: "По лекарствам", label: "drug" },
];

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("recipe");

  const {
    data: prescriptions,
    isFetching: isFetchingPrescriptions,
    isLoading: isLoadingPrescriptions,
  } = useGetMonthlyPrescriptionReportQuery();

  const {
    data: drugs,
    isFetching: isFetchingDrugs,
    isLoading: isLoadingDrugs,
  } = useGetMonthlyDrugReportQuery();

  // Выбираем массив для текущей вкладки
  const filter = selectedFilter === "recipe" ? prescriptions : drugs;

  // Итоги
  const totalIssued =
    selectedFilter === "recipe"
      ? filter?.reduce((sum, item) => sum + (item.total_prescriptions || 0), 0)
      : filter?.reduce((sum, item) => sum + (item.total_drugs || 0), 0) || 0;

  const totalPicked =
    filter?.reduce((sum, item) => sum + (item.picked_up || 0), 0) || 0;

  const loading =
    selectedFilter === "recipe"
      ? isFetchingPrescriptions || isLoadingPrescriptions
      : isFetchingDrugs || isLoadingDrugs;

  return (
    <Spin spinning={loading}>
      <main className={clsx(styles.patient, "relative")}>
        {/* Фильтр кнопками */}
        <Flex
          vertical
          className={clsx(styles.prescrip_add, "container")}
          justify="space-between"
          gap="small"
        >
          <Flex gap="small">
            {btns.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedFilter(item.label)}
                style={{ whiteSpace: "nowrap", display: "inline-block" }}
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

        {/* Таблица */}
        <section className={clsx("container")}>
          <Flex
            className={clsx("mt-2")}
            vertical
            style={{ maxHeight: "350px", overflowY: "auto", gap: "16px" }}
          >
            <div className={clsx(styles.recipeCard)}>
              <table className={clsx(styles.recipeTable)}>
                <thead>
                  <tr>
                    <th>Дата</th>
                    {selectedFilter === "drug" && <th>Медикамент</th>}
                    <th style={{ textAlign: "center" }}>
                      {selectedFilter === "recipe" ? "Выдано" : "Выдано"}
                    </th>
                    {selectedFilter === "recipe" && (
                      <th style={{ textAlign: "center" }}>Получили</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filter?.map((item) => (
                    <tr key={item?.day + (item?.drugName || "")}>
                      <td>{dayjs.utc(item?.day).format("DD.MM.YYYY")}</td>
                      {selectedFilter === "drug" && <td>{item?.drugName}</td>}
                      <td style={{ textAlign: "center" }}>
                        {selectedFilter === "recipe"
                          ? item?.total_prescriptions
                          : item?.total_drugs}
                      </td>
                      {selectedFilter === "recipe" && (
                        <td style={{ textAlign: "center" }}>
                          {item?.picked_up}
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* Итого */}
                  <tr style={{ fontWeight: "bold" }}>
                    <td>Итого</td>
                    {selectedFilter === "drug" && <td></td>}
                    <td style={{ textAlign: "center" }}>{totalIssued}</td>

                    {selectedFilter === "recipe" && (
                      <td style={{ textAlign: "center" }}>{totalPicked}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </Flex>

          {/* Кнопка на главную */}
          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn_home)}
              onClick={() => navigate(`/`)}
            >
              На главную страницу
            </button>
          </div>
        </section>
      </main>
    </Spin>
  );
};
