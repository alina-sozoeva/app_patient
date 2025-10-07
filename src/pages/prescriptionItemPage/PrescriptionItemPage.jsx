import { useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Spin } from "antd";

import {
  CalendarOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneFilled,
  RedoOutlined,
} from "@ant-design/icons";
import { gender } from "../../enums";
import { useState } from "react";
import { EditPatientModal } from "../../components";

import {
  useAddPatientPrescriptionMutation,
  useGetMappedRecipesQuery,
  useGetPatientsQuery,
} from "../../store";

import { MdSaveAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaUserDoctor } from "react-icons/fa6";
import { printPrescription } from "../../utils";

import styles from "./PrescriptionItemPage.module.scss";
import clsx from "clsx";

import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");
dayjs.extend(utc);

export const PrescriptionItemPage = () => {
  const { guid, codeid } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [openUpdate, setOpenUpdate] = useState(false);

  const { data: patients, isLoading, isFetching } = useGetPatientsQuery();
  const { data: mappedData } = useGetMappedRecipesQuery({});
  const [add] = useAddPatientPrescriptionMutation();

  const findPatient = patients?.find((item) => item?.guid === guid);

  const filterdData = mappedData?.find(
    (item) => +item?.prescription_codeid === +codeid
  );

  const handlePrint = async (prescription) => {
    printPrescription({ prescription, findPatient, user });
  };

  const handleRepeatPrescription = async (prescription) => {
    if (!findPatient || !prescription?.items) return;

    const recipeItems = prescription.items.map((item) => ({
      drugId: +item.drug_codeid,
      formName: item.form_name,
      dose: item.doseName,
      method: +item.method_use_codeid,
      course: +item.courseName,
      frequency: +item.frequency_codeid,
      before: item.time_before_food ? 1 : 0,
      during: item.time_during_food ? 1 : 0,
      after: item.time_after_food ? 1 : 0,
      quantity: item.quantity || "",
    }));

    const payload = {
      patient: {
        fio: findPatient.fio,
        date_birth: dayjs(findPatient.birth_date).format("YYYY-MM-DD"),
        gender: findPatient.gender,
        pharmacy_id: findPatient.pharmacy_id,
        phone: findPatient.phone,
        email: findPatient.email,
      },
      recipeItems,
      doctorCode: user?.codeid,
    };

    try {
      await add(payload).unwrap();
      navigate(`/patient/${findPatient.guid}`);
      window.location.reload();
    } catch (err) {
      console.error("Ошибка при повторении рецепта:", err);
    }
  };

  console.log(filterdData, "filterdData");

  return (
    <Spin spinning={isLoading || isFetching}>
      <main className={clsx(styles.patient, "relative")}>
        <section className={clsx("container relative")}>
          <Flex
            className={clsx(styles.patient_header)}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Данные пациента</span>
            <button className={clsx(styles.tel)}>
              <a href={`tel:${findPatient?.phone}`}>
                Позвонить <PhoneFilled />
              </a>
            </button>
          </Flex>

          <Flex vertical className={clsx(styles.patient_about)}>
            <Flex justify="space-between" align="center">
              <Flex vertical>
                <Flex className={clsx(styles.patient_info, "gap-[3px]")}>
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

                {findPatient?.email && (
                  <span className={clsx(styles.patient_info_gender)}>
                    <MailOutlined /> {findPatient?.email}
                  </span>
                )}
              </Flex>
            </Flex>
          </Flex>
        </section>

        <section className={clsx("container")}>
          {/* {test?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} */}

          <Flex
            className={clsx("mt-2")}
            vertical
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              gap: "16px",
            }}
          >
            {/* {test?.map((item) => ( */}
            <div className={clsx(styles.recipeCard)}>
              <Flex>
                <h3>
                  Рецепт{" "}
                  <b style={{ color: "var(--primary-color)" }}>
                    №{filterdData?.prescription_codeid}
                  </b>
                </h3>
              </Flex>

              <Flex
                justify="space-between"
                className={clsx(styles.recipeCardInfo, "my-2")}
              >
                <Flex align="center" className={clsx("gap-[5px]")}>
                  <FaUserDoctor />
                  {filterdData?.doctor?.name}
                </Flex>

                <p>
                  <CalendarOutlined style={{ marginRight: 4 }} />

                  {dayjs
                    .utc(filterdData?.created_at)
                    .format("DD.MM.YYYY HH:mm")}
                </p>
              </Flex>

              <table className={clsx(styles.recipeTable)}>
                <thead>
                  <tr>
                    <th>Медикаменты</th>
                    <th>Доза</th>
                    <th>Прием</th>
                    <th>Курс</th>
                  </tr>
                </thead>
                <tbody>
                  {filterdData?.items.map((med) => (
                    <tr key={med.codeid}>
                      <td>
                        <Flex vertical>
                          <span>{med.drugName}</span>
                          <span>({med.form_name})</span>
                        </Flex>
                      </td>
                      <td>{med.doseName}</td>
                      <td>
                        {med.time_before_food && "до еды "}
                        {med.time_during_food && "во время еды "}
                        {med.time_after_food && "после еды "}
                      </td>
                      <td>{med.courseName} д.</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Flex
                justify="end"
                gap="8px"
                className={clsx(styles.recipeActions)}
              >
                {filterdData?.status === 1 && (
                  <Button
                    icon={<RedoOutlined />}
                    onClick={() => handleRepeatPrescription(filterdData)}
                    style={{ backgroundColor: "#ffa940", color: "white" }}
                  >
                    Повторить
                  </Button>
                )}

                <Button
                  icon={<MdSaveAlt />}
                  onClick={() => handlePrint(filterdData)}
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
            {/* ))} */}
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
