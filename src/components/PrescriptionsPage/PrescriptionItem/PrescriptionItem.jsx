import { Flex } from "antd";

import styles from "./PrescriptionItem.module.scss";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ru";

dayjs.extend(utc);
dayjs.locale("ru");

export const PrescriptionItem = ({ item, onClick }) => {
  return (
    <Flex
      className={clsx(styles.item)}
      justify="space-between"
      onClick={onClick}
    >
      <span className={clsx(styles.item_info_fio)}>Рецепт №{item?.codeid}</span>
      <span className={clsx(styles.item_info_bday)}>
        {dayjs.utc(item.created_at).format("DD.MM.YYYY HH:mm")}
      </span>
    </Flex>
  );
};
