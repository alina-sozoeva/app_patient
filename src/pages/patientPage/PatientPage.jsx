import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Flex, Spin } from "antd";

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
  useGetCoursesQuery,
  useGetDoseQuery,
  useGetDrugQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
  useGetRecipeItemQuery,
  useGetRecipeQuery,
} from "../../store";

import { MdSaveAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { users } from "../../data";
import { FaUserDoctor } from "react-icons/fa6";

import { printPrescription } from "../../utils";
import { useMappedRecipes } from "../../hooks";

import styles from "./PatientPage.module.scss";
import clsx from "clsx";

import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");
dayjs.extend(utc);

export const PatientPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false);

  const { data: patients, isLoading, isFetching } = useGetPatientsQuery();
  const { data: recipe } = useGetRecipeQuery();
  const { data: recipeItem } = useGetRecipeItemQuery();
  const { data: doses } = useGetDoseQuery();
  const { data: drugs } = useGetDrugQuery({});
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();
  const [add] = useAddPatientPrescriptionMutation();

  const userId = useSelector((state) => state.user.userId);
  const findUser = users.find((item) => item.id === +userId);

  const findPatient = patients?.find((item) => item?.guid === guid);

  const findRecipe = recipe?.filter(
    (item) => +item?.patient_codeid === +findPatient?.codeid
  );

  const mappedRecipes = recipeItem?.filter((item) =>
    findRecipe?.some((presc) => presc?.codeid === item?.prescription_codeid)
  );

  const groupedRecipes = mappedRecipes?.reduce((acc, item) => {
    const key = item?.prescription_codeid;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const mappedRecipesWithNames = useMappedRecipes({
    groupedRecipes,
    findRecipe: recipe,
    drugs,
    doses,
    methodUse,
    courses,
    frequency,
  });

  const handlePrint = async (prescription) => {
    printPrescription({ prescription, findPatient, findUser });
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
      doctorCode: 123,
    };

    try {
      await add(payload).unwrap();
      navigate(`/patient/${findPatient.guid}`);
      window.location.reload();
    } catch (err) {
      console.error("Ошибка при повторении рецепта:", err);
    }
  };

  console.log(mappedRecipesWithNames, "mappedRecipesWithNames");

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
            <Flex justify="space-between">
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
                <span className={clsx(styles.patient_info_gender)}>
                  <MailOutlined /> {findPatient?.email}
                </span>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            className={clsx(styles.patient_header, "container")}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Выписанные рецепты</span>
          </Flex>
        </section>

        <section className={clsx("container")}>
          {mappedRecipesWithNames?.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}

          <Flex
            className={clsx("mt-2")}
            vertical
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              gap: "16px",
            }}
          >
            {mappedRecipesWithNames?.map((item) => (
              <div className={clsx(styles.recipeCard)}>
                <Flex>
                  <h3>
                    Рецепт{" "}
                    <b style={{ color: "var(--primary-color)" }}>
                      №{item.prescription_codeid}
                    </b>
                  </h3>
                </Flex>

                <Flex
                  justify="space-between"
                  className={clsx(styles.recipeCardInfo, "my-2")}
                >
                  <Flex align="center" className={clsx("gap-[5px]")}>
                    <FaUserDoctor />
                    {findUser?.name}
                  </Flex>

                  <p>
                    <CalendarOutlined style={{ marginRight: 4 }} />

                    {dayjs.utc(item.created_at).format("DD.MM.YYYY HH:mm")}
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
                    {item.items.map((med) => (
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
                  {item?.status === 1 && (
                    <Button
                      icon={<RedoOutlined />}
                      onClick={() => handleRepeatPrescription(item)}
                      style={{ backgroundColor: "#ffa940", color: "white" }}
                    >
                      Повторить
                    </Button>
                  )}

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

                  <Button type="primary" icon={<MailOutlined />}>
                    Почта
                  </Button>
                </Flex>
              </div>
            ))}
          </Flex>

          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn)}
              onClick={() => navigate(`/new-rx/${guid}`)}
            >
              Новый рецепт
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
