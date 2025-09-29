import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Flex, Spin } from "antd";

import {
  CalendarOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneFilled,
} from "@ant-design/icons";
import { gender } from "../../enums";
import { useState } from "react";
import { EditPatientModal } from "../../components";

import {
  useGetClinicsQuery,
  useGetPatientsQuery,
  useGetReferralsItemQuery,
  useGetReferralsQuery,
  useGetServicesQuery,
} from "../../store";

import { useSelector } from "react-redux";
import { printReferral } from "../../utils";

import styles from "./DiagnosticsItemPage.module.scss";
import clsx from "clsx";

import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useMappedReferrals } from "../../hooks";
import { FaUserDoctor } from "react-icons/fa6";
import { MdSaveAlt } from "react-icons/md";

dayjs.locale("ru");
dayjs.extend(utc);

export const DiagnosticsItemPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false);

  const { data: patients, isLoading, isFetching } = useGetPatientsQuery();
  const { data: referrals } = useGetReferralsQuery();
  const { data: referralsItem } = useGetReferralsItemQuery();
  const { data: clinics } = useGetClinicsQuery();
  const { data: services } = useGetServicesQuery();

  const user = useSelector((state) => state.user.user);

  const findPatient = patients?.find((item) => item?.guid === guid);

  const handlePrint = async (prescription) => {
    printReferral({ prescription, findPatient, user });
  };

  const mappedReferrals = useMappedReferrals({
    referrals,
    referralsItem,
    services,
    clinics,
  });

  const filter = mappedReferrals?.filter(
    (item) => +item?.patient_codeid === +findPatient?.codeid
  );

  console.log(filter, "filter");

  return (
    <Spin spinning={isLoading || isFetching}>
      <main className={clsx(styles.patient, "relative")}>
        <section className={clsx("container relative")}>
          <Flex
            className={clsx(styles.patient_header)}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Профиль</span>
            <button className={clsx(styles.tel)}>
              <a href={`tel:${findPatient?.phone}`}>
                Позвонить <PhoneFilled />
              </a>
            </button>
          </Flex>

          <Flex vertical className={clsx(styles.patient_about)}>
            <Flex justify="space-between" align="center">
              <Flex vertical>
                <Flex vertical className={clsx(styles.patient_info)}>
                  <span className={clsx(styles.patient_info_fio)}>
                    {findPatient?.fio},
                  </span>
                  <span className={clsx(styles.patient_info_bday)}>
                    {dayjs(findPatient?.birth_date).format("D MMMM YYYY г.")},{" "}
                    {gender[findPatient?.gender]}
                  </span>
                </Flex>
                <span className={clsx(styles.patient_info_gender)}></span>
                <span className={clsx(styles.patient_info_gender)}>
                  <PhoneFilled /> {findPatient?.phone}
                </span>
                <span className={clsx(styles.patient_info_gender)}>
                  <MailOutlined /> {findPatient?.email}
                </span>
              </Flex>
              <button
                className={clsx(styles.create_btn)}
                onClick={() => navigate(`/new-referral/${guid}`)}
              >
                + Новое направление
              </button>
            </Flex>
          </Flex>

          <Flex
            className={clsx(styles.patient_header, "container")}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Выписанные направления</span>
          </Flex>
        </section>

        <section className={clsx("container")}>
          <Flex
            className={clsx("mt-2")}
            vertical
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              gap: "16px",
            }}
          >
            {filter?.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              filter?.map((item) => (
                <div className={clsx(styles.recipeCard)}>
                  <Flex>
                    <h3>
                      Направление{" "}
                      <b style={{ color: "var(--primary-color)" }}>
                        №{item.codeid}
                      </b>
                    </h3>
                  </Flex>

                  <Flex
                    justify="space-between"
                    className={clsx(styles.recipeCardInfo, "my-2")}
                  >
                    <Flex align="center" className={clsx("gap-[5px]")}>
                      <FaUserDoctor />
                      {user?.nameid}
                    </Flex>

                    <p>
                      <CalendarOutlined style={{ marginRight: 4 }} />

                      {dayjs.utc(item.created_at).format("DD.MM.YYYY HH:mm")}
                    </p>
                  </Flex>

                  <span>
                    <b>Клиника:</b> {item?.clinicName}
                  </span>

                  <table className={clsx(styles.recipeTable)}>
                    <thead>
                      <tr>
                        <th>Услуги</th>
                        <th>Цена</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(item?.items ?? []).map((med) => (
                        <tr key={med.codeid}>
                          <td>
                            <span>{med.serviceName}</span>
                          </td>
                          <td>{med.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Flex
                    justify="end"
                    gap="8px"
                    className={clsx(styles.recipeActions)}
                  >
                    <Button
                      icon={<MdSaveAlt />}
                      onClick={() => handlePrint(item)}
                      style={{ backgroundColor: "#1890ff", color: "white" }}
                    >
                      Сохранить
                    </Button>

                    <Button
                      style={{ backgroundColor: "#52c41a", color: "white" }}
                      icon={<MessageOutlined />}
                    >
                      SMS
                    </Button>

                    <Button
                      type="primary"
                      icon={<MailOutlined />}
                      style={{
                        backgroundColor: "#C8A2C8",
                        borderColor: "#C8A2C8",
                        color: "white",
                      }}
                    >
                      Почта
                    </Button>
                  </Flex>
                </div>
              ))
            )}
          </Flex>

          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn_home)}
              onClick={() => navigate(`/`)}
            >
              На главную страницу
            </button>
          </div>
        </section>

        <EditPatientModal
          open={openUpdate}
          onCancel={() => setOpenUpdate(false)}
          item={findPatient}
          title={"пациента"}
        />
      </main>
    </Spin>
  );
};
