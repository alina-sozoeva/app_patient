import { RightOutlined } from "@ant-design/icons";
import { Flex } from "antd";

import styles from "./MedHistoryItem.module.scss";
import clsx from "clsx";

export const MedHistoryItem = ({ item }) => {
  return (
    <Flex className={clsx(styles.item)} justify="space-between">
      <Flex vertical>
        <span>
          <b>
            {item?.drugName} {item?.doseName} ({item?.form_name})
          </b>
        </span>
        <span>Без повторных назначений</span>
        <span>Принимать {item?.frequencyName}</span>
        <span className={clsx(styles.item_sub)}>Замена разрешена</span>
        {/* <Flex>
          <span>
            <b>Дата начала:</b> 31/06/2023 {item?.start_date}
          </span>
        </Flex> */}
        <Flex>
          <span>
            <b>Принимать:</b> {item?.time_after_food && "после еды"}
            {item?.time_before_food && "до обеда"}
            {item?.time_during_food && "во время еды"}
          </span>
        </Flex>
      </Flex>
      <RightOutlined />
    </Flex>
  );
};
