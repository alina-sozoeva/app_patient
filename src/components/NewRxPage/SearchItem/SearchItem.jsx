import { Flex } from "antd";

import { CaretUpOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./SearchItem.module.scss";
import clsx from "clsx";

export const SearchItem = ({ item, onNavigate }) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex vertical>
      <Flex
        className={clsx(styles.search)}
        align="center"
        justify="space-between"
      >
        <Flex vertical>
          <span>
            <b>{item.name}</b>
          </span>
          <span>({item.form})</span>
          <span>{item.use}</span>
        </Flex>

        <Flex gap="small" className={clsx(styles.btn)}>
          <span>u</span>
          <button onClick={() => setOpen(!open)}>
            <span>{item.strength.length}</span>
            <CaretUpOutlined />
          </button>
        </Flex>
      </Flex>
      {open && (
        <Flex
          gap="middle"
          vertical
          className={styles.strength}
          onClick={onNavigate}
        >
          {item.strength.map((i) => (
            <Flex justify="space-between">
              <span>{i} u</span>
              <RightOutlined />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
