import { useState } from "react";
import { Flex } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { gender } from "../../enums";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import {
  useAddPatientPrescriptionMutation,
  useGetCoursesQuery,
  useGetDoseQuery,
  useGetFrequencyQuery,
  useGetMethodUseQuery,
  useGetPatientsQuery,
} from "../../store";

import styles from "./RxDetailsPage.module.scss";
import clsx from "clsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";

dayjs.extend(utc);
dayjs.locale("ru");

const quantity = ["4", "8", "24", "28", "30", "другое"];
const reception = ["до еды", "во время еды", "после еды"];

export const RxDetailsPage = () => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [dosesOpen, setDosesOpen] = useState(true);
  const [drugSelections, setDrugSelections] = useState({});

  const { data: patients } = useGetPatientsQuery();
  const { data: frequency } = useGetFrequencyQuery();
  const { data: methodUse } = useGetMethodUseQuery();
  const { data: courses } = useGetCoursesQuery();
  const { data: dosages } = useGetDoseQuery();

  const [add] = useAddPatientPrescriptionMutation();

  const findPatient = patients?.find((item) => item.guid === guid);
  const storedDrugs = JSON.parse(localStorage.getItem("selectedDrugs")) || [];

  console.log(findPatient, "findPatient");

  const updateSelection = (drugId, field, value) => {
    setDrugSelections((prev) => ({
      ...prev,
      [drugId]: {
        ...prev[drugId],
        [field]: value,
      },
    }));
  };
  console.log(drugSelections, "drugSelections");

  const onFinish = async () => {
    const patient = {
      fio: findPatient?.fio,
      date_birth: dayjs(findPatient?.birth_date).format("YYYY-MM-DD"),
      gender: findPatient?.gender,
      pharmacy_id: findPatient?.pharmacy_id,
      phone: findPatient?.phone,
      email: findPatient?.email,
    };

    const recipeItems = storedDrugs
      .map((drug) => {
        const selection = drugSelections[drug.codeid];
        return {
          drugId: drug.codeid,
          formName: drug.form_name,
          dose: selection?.dose,
          method: methodUse?.[0]?.codeid,
          course: selection?.course,
          frequency: selection?.frequency,
          before: selection?.time === "до еды" ? 1 : 0,
          during: selection?.time === "во время еды" ? 1 : 0,
          after: selection?.time === "после еды" ? 1 : 0,
          quantity: selection?.quantity,
        };
      })
      .filter(Boolean);

    await add({
      patient,
      recipeItems,
      doctorCode: 123,
    }).unwrap();

    localStorage.removeItem("selectedDrugs");

    navigate(`/patient/${guid}`);
  };

  const disabled = storedDrugs.some((drug) => {
    const s = drugSelections[drug.codeid];
    return !s?.time || !s?.frequency || !s?.course || !s?.quantity;
  });

  return (
    <main className={clsx(" relative")}>
      <section className={clsx("container ")}>
        <Flex
          className={clsx(styles.patient_wrap)}
          justify="space-between"
          vertical
          //
        >
          <Flex gap="small" className={clsx(styles.patient_info)}>
            <span className={clsx(styles.patient_info_fio)}>
              <b>{findPatient?.fio}</b>
            </span>
            <span className={clsx(styles.patient_info_bday)}>
              {dayjs.utc(findPatient?.birth_date).format("D MMMM YYYY г.")}
            </span>
          </Flex>
          <span className={clsx(styles.patient_info_gender)}>
            {gender[findPatient?.gender || 0]}
          </span>
        </Flex>

        <div style={{ maxHeight: "660px", overflowY: "auto" }}>
          {storedDrugs.map((drug) => {
            const selection = drugSelections[drug.codeid] || {};
            return (
              <Flex
                vertical
                className={clsx(styles.patient_rx, "my-4")}
                key={drug.codeid}
              >
                <Flex vertical className={clsx("mb-4")}>
                  <span>
                    <b>{drug?.nameid}</b>
                  </span>
                  <span>
                    {drug?.nameid} ({drug?.form_name})
                  </span>
                </Flex>

                <Flex vertical>
                  {/* Продолжительность */}
                  <Flex
                    className={clsx(styles.patient_wrap)}
                    justify="space-between"
                  >
                    <span className={clsx(styles.patient_info_fio)}>
                      <b>Продолжительность</b>
                    </span>
                    <DownOutlined onClick={() => setDosesOpen(!dosesOpen)} />
                  </Flex>
                  {dosesOpen && (
                    <Flex vertical>
                      {frequency?.map((f) => (
                        <Flex
                          key={f.codeid}
                          className={clsx(
                            styles.item,
                            selection.frequency === f.codeid &&
                              styles.item_active
                          )}
                          justify="space-between"
                          onClick={() =>
                            updateSelection(drug.codeid, "frequency", f.codeid)
                          }
                        >
                          <span>
                            {f?.times_per_day} раза в день по{" "}
                            {f?.quantity_per_time} таблетке
                          </span>
                          <RightOutlined
                            style={{
                              color:
                                selection.frequency === f.codeid
                                  ? "gold"
                                  : "inherit",
                            }}
                          />
                        </Flex>
                      ))}
                    </Flex>
                  )}

                  {/* Кол-во таблеток */}
                  <Flex
                    className={clsx(styles.patient_wrap)}
                    justify="space-between"
                  >
                    <span className={clsx(styles.patient_info_fio)}>
                      <b>Количество таблеток</b>
                    </span>
                  </Flex>
                  <Flex className={clsx(styles.btns)} justify="space-between">
                    {quantity.map((q) => (
                      <button
                        key={q}
                        className={clsx(styles.btn, {
                          [styles.active]: selection.quantity === q,
                        })}
                        onClick={() =>
                          updateSelection(drug.codeid, "quantity", q)
                        }
                      >
                        {q}
                      </button>
                    ))}
                  </Flex>

                  {/* Кол-во дней */}
                  <Flex
                    className={clsx(styles.patient_wrap)}
                    justify="space-between"
                  >
                    <span className={clsx(styles.patient_info_fio)}>
                      <b>Количество дней</b>
                    </span>
                  </Flex>
                  <Flex className={clsx(styles.btns)} justify="space-between">
                    {courses?.map((c) => (
                      <button
                        key={c?.codeid}
                        className={clsx(styles.btn, {
                          [styles.active]: selection.course === c?.count_days,
                        })}
                        onClick={() =>
                          updateSelection(drug.codeid, "course", c?.count_days)
                        }
                      >
                        {c?.count_days}
                      </button>
                    ))}
                  </Flex>

                  {/* Дозировка */}
                  <Flex
                    className={clsx(styles.patient_wrap)}
                    justify="space-between"
                  >
                    <span className={clsx(styles.patient_info_fio)}>
                      <b>Дозировка</b>
                    </span>
                  </Flex>
                  <Flex className={clsx(styles.btns)} justify="space-between">
                    {dosages?.map((d) => (
                      <button
                        key={d?.codeid}
                        className={clsx(styles.btn, {
                          [styles.active]: selection.dose === d?.nameid,
                        })}
                        onClick={() =>
                          updateSelection(drug.codeid, "dose", d?.nameid)
                        }
                      >
                        {d?.nameid}
                      </button>
                    ))}
                  </Flex>

                  {/* Приём */}
                  <Flex
                    className={clsx(styles.patient_wrap)}
                    justify="space-between"
                  >
                    <span className={clsx(styles.patient_info_fio)}>
                      <b>Прием</b>
                    </span>
                  </Flex>
                  <Flex
                    className={clsx(styles.btns, "mb-2")}
                    justify="space-between"
                  >
                    {reception.map((r) => (
                      <button
                        key={r}
                        className={clsx(styles.btn, {
                          [styles.active]: selection.time === r,
                        })}
                        onClick={() => updateSelection(drug.codeid, "time", r)}
                      >
                        {r}
                      </button>
                    ))}
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        </div>

        <div className={clsx("mb-32")}></div>

        <div className={clsx(styles.create_btn_wrap, "container w-full ")}>
          <button
            disabled={disabled}
            className={clsx(
              disabled ? styles.create_btn_dis : styles.create_btn
            )}
            onClick={() => onFinish()}
          >
            {disabled ? <span>Выберете все пункты</span> : "Создать рецепт"}
          </button>
        </div>
      </section>
    </main>
  );
};
