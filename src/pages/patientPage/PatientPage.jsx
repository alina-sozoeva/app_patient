import { useParams } from "react-router-dom";
import { patients, pharmacies } from "../../data";
import { Flex } from "antd";

import styles from "./PatientPage.module.scss";
import clsx from "clsx";
import { PhoneFilled } from "@ant-design/icons";
import { gender } from "../../enums";

export const PatientPage = () => {
  const { id } = useParams();

  const findPatient = patients.find((item) => item.id === +id);

  const findPhar = pharmacies.find(
    (item) => item.id === findPatient.pharmacy_id
  );

  return (
    <main>
      <Flex
        className={clsx(styles.patient, "container")}
        justify="space-between"
        align="center"
      >
        <span>Профиль</span>
        <button>
          Позвонить <PhoneFilled />
        </button>
      </Flex>
      <Flex justify="space-between">
        <Flex vertical>
          <Flex gap="small" className={clsx(styles.item_info)}>
            <span className={clsx(styles.item_info_fio)}>
              {findPatient.fio}
            </span>
            <span className={clsx(styles.item_bday)}>
              ({findPatient.birthday})
            </span>
          </Flex>
          <span>{gender[findPatient.gender]}</span>
        </Flex>

        <span>Ркдактировать</span>
      </Flex>
      <Flex justify="space-between">
        <Flex vertical>
          <span>Аптека</span>
          <span>{findPhar.name}</span>
          <span>{findPhar.address}</span>
        </Flex>
        <span>Изменить</span>
      </Flex>
      <Flex
        className={clsx(styles.patient, "container")}
        justify="space-between"
        align="center"
      >
        <span>Активные метикаменты</span>
        <span>Изменить</span>
      </Flex>
      <button className={clsx(styles.create_btn)}>Создать рецепт</button>
    </main>
  );
};
