import { Flex } from "antd";
import { RightOutlined } from "@ant-design/icons";

import styles from "./PatientItem.module.scss";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";

dayjs.extend(utc);
dayjs.locale("ru");

export const PatientItem = ({ item, onClick }) => {
  return (
    <Flex
      justify="space-between"
      className={clsx(styles.item)}
      onClick={onClick}
    >
      <Flex className={clsx(styles.item_info)}>
        <span className={clsx(styles.item_info_fio)}>{item.fio}</span>
        <span className={clsx(styles.item_info_bday)}></span>
      </Flex>
      <RightOutlined />
    </Flex>
  );
};
