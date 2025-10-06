import { useSelector } from "react-redux";
import { useGetMonthlyPrescriptionReportQuery } from "../../../../store";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import styles from "./PrescriptionsInfo.module.scss";
import clsx from "clsx";
import { Flex } from "antd";
import { MailOutlined, PhoneFilled } from "@ant-design/icons";

export const PrescriptionsInfo = () => {
  const user = useSelector((state) => state.user.user);
  const { date } = useParams();

  const {
    data: prescriptions,
    isFetching,
    isLoading,
  } = useGetMonthlyPrescriptionReportQuery({ doctor_codeid: user?.codeid });

  const filterDate = dayjs(date, "DD.MM.YYYY").format("YYYY-MM-DD");

  const filteredPrescriptions = prescriptions?.find(
    (item) => dayjs(item?.day).format("YYYY-MM-DD") === filterDate
  );

  console.log(filteredPrescriptions, "filteredPrescriptions");

  return (
    <div>
      <section className={clsx("container relative")}>
        <Flex
          className={clsx(styles.patient_header)}
          justify="space-between"
          align="center"
        >
          <span className={clsx(styles.title)}>Данные врача</span>
        </Flex>

        <Flex vertical className={clsx(styles.patient_about)}>
          <Flex justify="space-between" align="center">
            <Flex vertical>
              <Flex className={clsx(styles.patient_info, "gap-[3px]")}>
                <span className={clsx(styles.patient_info_fio)}>
                  {filteredPrescriptions?.doctor?.name},
                </span>
              </Flex>
              <span className={clsx(styles.patient_info_gender)}></span>
              <span className={clsx(styles.patient_info_gender)}>
                <PhoneFilled /> {filteredPrescriptions?.doctor?.phone}
              </span>

              {filteredPrescriptions?.email && (
                <span className={clsx(styles.patient_info_gender)}>
                  <MailOutlined /> {filteredPrescriptions?.email}
                </span>
              )}
            </Flex>
          </Flex>
        </Flex>
      </section>
      <Flex
        className={clsx(styles.patient_header, "container")}
        justify="space-between"
        align="center"
      >
        <span className={clsx(styles.title)}>Рецепты</span>
      </Flex>
      <div
        className={clsx(styles.recipeCard)}
        style={{ maxHeight: "500px", overflowY: "auto", gap: "16px" }}
      >
        <table className={clsx(styles.recipeTable)}>
          <thead>
            <tr>
              <th>№</th>
              <th>Пациент</th>
              <th>Адрес выдачи</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions?.prescriptions?.map((item) => (
              <tr key={item?.prescription_codeid}>
                <td>{item?.prescription_codeid}</td>
                <td>{item?.patient?.fio}</td>
                <td>
                  {filteredPrescriptions?.doctor?.clinic?.address || "-"}{" "}
                </td>
                <td>{item?.status === 1 ? "Выдан" : "Не выдан"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
