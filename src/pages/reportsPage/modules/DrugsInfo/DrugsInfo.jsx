import { useSelector } from "react-redux";
import { useGetMonthlyDrugReportQuery } from "../../../../store";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import clsx from "clsx";
import styles from "./DrugsInfo.module.scss";
import { Flex } from "antd";
import { MailOutlined, PhoneFilled } from "@ant-design/icons";

export const DrugsInfo = () => {
  const user = useSelector((state) => state.user.user);
  const { date, drug } = useParams();

  const {
    data: drugsReport,
    isFetching,
    isLoading,
  } = useGetMonthlyDrugReportQuery({ doctor_codeid: user?.codeid });

  const filterDate = dayjs(date, "DD.MM.YYYY").format("YYYY-MM-DD");

  const filteredDay = drugsReport?.find(
    (item) =>
      dayjs(item.day).format("YYYY-MM-DD") === filterDate &&
      item.drugName === drug
  );

  console.log(filteredDay, "filteredDay");

  return (
    <div className={clsx("container")}>
      <Flex
        className={clsx(styles.patient_header, "container")}
        justify="space-between"
        align="center"
      >
        <span className={clsx(styles.title)}>{drug}</span>
      </Flex>
      <div
        className={clsx(styles.recipeCard)}
        style={{ maxHeight: "500px", overflowY: "auto", gap: "16px" }}
      >
        <table className={clsx(styles.recipeTable)}>
          <thead>
            <tr>
              <th>№ рецепта</th>
              <th>Аптека</th>
              <th>Адрес аптеки</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredDay?.sales?.map((item) => (
              <tr key={item?.prescription_codeid}>
                <td>{item?.prescription_codeid}</td>
                <td>{item?.pharmacyName || "-"}</td>
                <td>{item?.pharmacyAddress || "-"}</td>
                <td>{item?.picked_up ? "Выдан" : "Не выдан"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
