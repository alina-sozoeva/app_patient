import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button, Empty, Flex, Spin } from "antd";

import {
  CalendarOutlined,
  DownOutlined,
  EnvironmentOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneFilled,
  PhoneOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { gender } from "../../enums";
import { useEffect, useState } from "react";
import { EditFrequencyModal, EditPatientModal } from "../../components";

import {
  useGetCoursesQuery,
  useGetDoseQuery,
  useGetDrugQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
  useGetRecipeItemQuery,
  useGetRecipeQuery,
} from "../../store";

import QRCode from "qrcode";

import styles from "./PatientPage.module.scss";
import clsx from "clsx";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useGetPharmacyQuery } from "../../store/pharmacy/pharmacy.api";
import { MdSaveAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { users } from "../../data";
import utc from "dayjs/plugin/utc";
import { FaUserDoctor } from "react-icons/fa6";

dayjs.locale("ru");
dayjs.extend(utc);

export const PatientPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [dopInfo, setDopInfo] = useState(false);
  const [openEditFar, setOpenEditFar] = useState(false);

  const { data: patients, isLoading, isFetching } = useGetPatientsQuery();
  const { data: pharmacy } = useGetPharmacyQuery();
  const { data: recipe } = useGetRecipeQuery();
  const { data: recipeItem } = useGetRecipeItemQuery();
  const { data: doses } = useGetDoseQuery();
  const { data: drugs } = useGetDrugQuery({});
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();

  const userId = useSelector((state) => state.user.userId);
  const findUser = users.find((item) => item.id === +userId);

  const findPatient = patients?.find((item) => item?.guid === guid);

  const findRecipe = recipe?.filter(
    (item) => +item?.patient_codeid === +findPatient?.codeid
  );

  console.log(findRecipe, "findRecipe");

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

  const mappedRecipesWithNames = Object.entries(groupedRecipes || {})
    .sort((a, b) => +b[0] - +a[0])
    .map(([prescription_codeid, items]) => {
      const recipeData = findRecipe?.find(
        (r) => +r.codeid === +prescription_codeid
      );

      return {
        prescription_codeid,
        created_at: recipeData?.created_at,
        items: items.map((item) => {
          const drug = drugs?.find((d) => d.codeid === +item.drug_codeid);
          const dose = doses?.find((d) => d.codeid === +item.dose_codeid);
          const method = methodUse?.find(
            (m) => m.codeid === +item.method_use_codeid
          );
          const course = courses?.find((c) => c.codeid === +item.course_codeid);
          const freq = frequency?.find(
            (f) => f.codeid === +item.frequency_codeid
          );

          return {
            ...item,
            drugName: drug?.nameid || "",
            doseName: dose?.nameid || "",
            methodName: method?.nameid || "",
            courseName: course?.count_days || "",
            frequencyName: freq?.times_per_day
              ? `${freq.times_per_day} раза в день по ${
                  freq.quantity_per_time || 1
                } таблетке`
              : "",
          };
        }),
      };
    });

  console.log(findPatient?.codeid, "findPatient?.patient_codeid");

  const pharmacyItem = pharmacy?.[0];

  const handlePrint = async (prescription) => {
    let iframe = document.getElementById("print-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.id = "print-iframe";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();

    const qrData = `/patient/${findPatient?.codeid}/${prescription?.prescription_codeid}`;
    const qrUrl = await QRCode.toDataURL(qrData);

    let html = `
<html>
  <head>
    <title>Рецепт</title>
    <style>
      body { 
        font-family: 'Times New Roman', Georgia, serif; 
        padding: 30px; 
        color: #000;
      }
      h1, h2 { 
        text-align: center; 
        margin: 0;
      }
      h2 { 
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: normal;
      }
      .header {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 30px;
      }
      .header div {
        font-size: 14px;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-bottom: 30px;
        font-size: 14px;
      }
      th, td { 
        border: 1px solid #000; 
        padding: 6px 10px; 
        text-align: left;
      }
      th { 
        background-color: #f0f0f0; 
      }
      .qr {
        text-align: center; 
        margin-top: 20px;
      }
      .qr img {
        width: 120px; 
        height: 120px;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
        color: #555;
      }
    </style>
  </head>
  <body>
  <h1 style="font-size: 24px; font-weight: bold; text-align: left; margin-bottom: 20px;">LOGO</h1>

    <h1>РЕЦЕПТ</h1>

    <div class="header">
      <div>
        <p><strong>Пациент:</strong> ${findPatient?.fio}</p>
        <p><strong>Дата рождения:</strong> ${dayjs(
          findPatient?.birth_date
        ).format("DD.MM.YYYY")}</p>
      </div>
      <div>
        <p><strong>Врач:</strong> ${findUser?.name || "-"}</p>
        <p><strong>Дата создания:</strong> ${dayjs
          .utc(prescription.created_at)
          .format("DD.MM.YYYY HH:mm")}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Лекарство</th>
          <th>Форма</th>
          <th>Приём</th>
          <th>Курс (дни)</th>
        </tr>
      </thead>
      <tbody>
        ${prescription.items
          .map(
            (item) => `
          <tr>
            <td>${item.drugName} ${item.doseName}</td>
            <td>${item.form_name || "-"}</td>
            <td>
              ${item.time_before_food ? "до еды " : ""}
              ${item.time_during_food ? "во время еды " : ""}
              ${item.time_after_food ? "после еды" : ""}
            </td>
            <td>${item.courseName}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="qr">
      <img src="${qrUrl}" />
      <p>Отсканируйте QR-код для получения рецепта</p>
    </div>

    <div class="footer">
      Документ сформирован автоматически
    </div>
  </body>
</html>
`;

    doc.write(html);
    doc.close();

    const images = doc.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

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

            {dopInfo && (
              <Flex justify="space-between" className={clsx("pt-4")}>
                <Flex vertical>
                  <span className={clsx(styles.title)}>Аптека</span>
                  <span>
                    <b>
                      <PhoneFilled />
                    </b>{" "}
                    {pharmacyItem?.nameid}
                  </span>
                  <span style={{ maxWidth: "160px" }}>
                    <b>
                      <EnvironmentOutlined />
                    </b>{" "}
                    {pharmacyItem?.address}
                  </span>
                </Flex>
                {/* <span
                  className={clsx(styles.act_btn)}
                  onClick={() => setOpenEditFar(true)}
                >
                  Изменить
                </span> */}
              </Flex>
            )}
            <div
              className={clsx(styles.dop_arr)}
              onClick={() => setDopInfo(!dopInfo)}
            >
              <DownOutlined rotate={dopInfo && 180} />
            </div>
          </Flex>

          <Flex
            className={clsx(styles.patient_header, "container")}
            justify="space-between"
            align="center"
          >
            <span className={clsx(styles.title)}>Рецепты</span>
            {/* <span className={clsx(styles.act_btn)}>Изменить</span> */}
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
                  <h3>Рецепт №{item.prescription_codeid}</h3>
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
                  <Button
                    icon={<MdSaveAlt />}
                    onClick={() => handlePrint(item)}
                    style={{ backgroundColor: "#1890ff", color: "white" }}
                  ></Button>

                  <Button
                    style={{ backgroundColor: "#52c41a", color: "white" }}
                    icon={<MessageOutlined />}
                  ></Button>

                  <Button type="primary" icon={<MailOutlined />}></Button>
                </Flex>
              </div>
            ))}
          </Flex>

          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn)}
              onClick={() => navigate(`/new-rx/${guid}`)}
            >
              Добавить рецепт
            </button>
          </div>
        </section>
        <EditPatientModal
          open={openUpdate}
          onCancel={() => setOpenUpdate(false)}
          item={findPatient}
          title={"пациента"}
        />
        <EditFrequencyModal
          open={openEditFar}
          title={"аптеку"}
          onCancel={() => setOpenEditFar(false)}
          item={pharmacyItem}
        />
      </main>
    </Spin>
  );
};
