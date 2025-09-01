import { Flex } from "antd";
import styles from "./FavoriteItem.module.scss";
import { RightOutlined, StarFilled } from "@ant-design/icons";
import clsx from "clsx";

export const FavoriteItem = ({ item }) => {
  return (
    <Flex vertical className={clsx(styles.fav)}>
      <Flex justify="space-between" className={clsx(styles.fav_info)}>
        <Flex vertical>
          <span>
            <b>
              {item.name} {item.strength}
            </b>
          </span>
          <span>
            <b>{item.description}</b>
          </span>
        </Flex>
        <StarFilled style={{ color: "gold" }} />
      </Flex>
      <Flex justify="space-between">
        <span>Принимать </span>
        <RightOutlined />
      </Flex>
    </Flex>
  );
};
