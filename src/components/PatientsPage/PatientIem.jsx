import { Flex } from "antd";
import { RightOutlined } from "@ant-design/icons";

import styles from "./PatientIem.module.scss";
import clsx from "clsx";

export const PatientIem = ({ item, onClick }) => {
  return (
    <Flex
      justify="space-between"
      className={clsx(styles.item)}
      onClick={onClick}
    >
      <Flex className={clsx(styles.item_info)}>
        <span className={clsx(styles.item_info_fio)}>{item.fio}</span>
        <span className={clsx(styles.item_bday)}>({item.birthday})</span>
      </Flex>
      <RightOutlined />
    </Flex>
  );
};
