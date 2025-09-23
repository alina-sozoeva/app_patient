import { Flex } from "antd";

import styles from "./PrescriptionItem.module.scss";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";
import { RightOutlined } from "@ant-design/icons";

dayjs.extend(utc);
dayjs.locale("ru");

export const PrescriptionItem = ({ item, onClick }) => {
  return (
    <Flex
      className={clsx(styles.item)}
      justify="space-between"
      onClick={() => onClick(item?.prescription_codeid, item?.patient?.guid)}
    >
      <Flex gap="small">
        <span className={clsx(styles.item_info_fio)}>
          №{item?.prescription_codeid}
        </span>
        <span className={clsx(styles.item_info_fio)}>{item?.patient?.fio}</span>
      </Flex>
      <Flex gap="small">
        <span className={clsx(styles.item_info_bday)}>
          {dayjs.utc(item?.created_at).format("DD.MM.YYYY HH:mm")}
        </span>
        <RightOutlined />
      </Flex>
    </Flex>
  );
};
