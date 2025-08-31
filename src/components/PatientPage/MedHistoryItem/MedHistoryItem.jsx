import { RightOutlined } from "@ant-design/icons";
import { Flex } from "antd";

import styles from "./MedHistoryItem.module.scss";
import clsx from "clsx";

export const MedHistoryItem = ({ item }) => {
  return (
    <Flex className={clsx(styles.item)} justify="space-between">
      <Flex vertical>
        <span>
          <b>{item.name}</b>
        </span>
        <span>
          {item.quantity}, {item.refills}
        </span>
        <span>{item.instructions}</span>
        <span className={clsx(styles.item_sub)}>{item.substitution}</span>
        <Flex>
          <span>
            <b>Дата начала:</b> {item.start_date}
          </span>
        </Flex>
        <Flex>
          <span>
            <b>Дата окончания приема:</b> {item.last_written}
          </span>
        </Flex>
      </Flex>
      <RightOutlined />
    </Flex>
  );
};
