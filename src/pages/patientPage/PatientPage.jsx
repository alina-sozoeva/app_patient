import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Empty, Flex, Spin } from "antd";

import { DownOutlined, PhoneFilled } from "@ant-design/icons";
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
dayjs.locale("ru");

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
  const { data: drugs } = useGetDrugQuery();
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();

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
    .map(([prescription_codeid, items]) => ({
      prescription_codeid,
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
    }));

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

    // Генерация QR с URL
    const qrData = `/patient/${findPatient?.codeid}/${prescription?.prescription_codeid}`;
    const qrUrl = await QRCode.toDataURL(qrData);

    let html = `
    <html>
      <head>
        <title>Печать рецепта</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background-color: #f4f4f4; }
          img { display: block; margin: 20px auto; width: 150px; height: 150px; }
        </style>
      </head>
      <body>
        <h2>Рецепт №${prescription.prescription_codeid}</h2>
        <table>
          <thead>
            <tr>
              <th>Лекарство</th>
              <th>Доза</th>
              <th>Прием</th>
              <th>Курс (дни)</th>
            </tr>
          </thead>
          <tbody>
  `;

    prescription.items.forEach((item) => {
      html += `
      <tr>
        <td>${item.drugName} ${item.doseName}</td>
        <td>${item.form_name || "-"}</td>
        <td>
          ${item.time_after_food ? "после еды " : ""} 
          ${item.time_before_food ? "до еды " : ""} 
          ${item.time_during_food ? "во время еды " : ""}
        </td>
        <td>${item.courseName}</td>
      </tr>
    `;
    });

    html += `
          </tbody>
        </table>

        <img src="${qrUrl}" />
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
                <Flex gap="small" className={clsx(styles.patient_info)}>
                  <span className={clsx(styles.patient_info_fio)}>
                    {findPatient?.fio}
                  </span>
                  <span className={clsx(styles.patient_info_bday)}>
                    {dayjs(findPatient?.birth_date).format("D MMMM YYYY г.")}
                  </span>
                </Flex>
                <span className={clsx(styles.patient_info_gender)}>
                  <b>Пол:</b> {gender[findPatient?.gender]}
                </span>
                <span className={clsx(styles.patient_info_gender)}>
                  <b>Email:</b> {findPatient?.phone}
                </span>
                <span className={clsx(styles.patient_info_gender)}>
                  <b>Телефон:</b> {findPatient?.email}
                </span>
              </Flex>

              {/* <span
                className={clsx(styles.act_btn)}
                onClick={() => setOpenUpdate(true)}
              >
                Редактировать
              </span> */}
            </Flex>

            {dopInfo && (
              <Flex justify="space-between" className={clsx("pt-4")}>
                <Flex vertical>
                  <span className={clsx(styles.title)}>Аптека</span>
                  <span>
                    <b>Телефон:</b> {pharmacyItem?.nameid}
                  </span>
                  <span style={{ maxWidth: "160px" }}>
                    <b>Адрес:</b> {pharmacyItem?.address}
                  </span>
                </Flex>
                <span
                  className={clsx(styles.act_btn)}
                  onClick={() => setOpenEditFar(true)}
                >
                  Изменить
                </span>
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
            <span className={clsx(styles.title)}>Активные медикаменты</span>
            {/* <span className={clsx(styles.act_btn)}>Изменить</span> */}
          </Flex>
        </section>

        <section className={clsx("container")}>
          <div className={clsx(styles.active_med)}>
            <Flex
              className={clsx(styles.active_med_title)}
              justify="space-between"
            >
              <span>Медицинская история</span>
              {/* <span className={clsx(styles.act_btn)}>Вытащить запись</span> */}
            </Flex>
          </div>
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
                <h3>Рецепт №{item.prescription_codeid}</h3>
                <table className={clsx(styles.recipeTable)}>
                  <thead>
                    <tr>
                      <th>Лекарство</th>
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
                  <button onClick={() => handlePrint(item)}>Сохранить</button>
                  <button>SMS</button>
                  <button>Почта</button>
                </Flex>
              </div>
            ))}
          </Flex>

          <div className={clsx("container", styles.create_btn_wrap)}>
            <button
              className={clsx(styles.create_btn)}
              onClick={() => navigate(`/new-rx/${guid}`)}
            >
              Создать рецепт
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
