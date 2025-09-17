import { Checkbox, Flex } from "antd";

import { useGetMethodUseQuery } from "../../../store";

import styles from "./SearchItem.module.scss";
import clsx from "clsx";

export const SearchItem = ({ item, selectedDrugs, toggleDrug }) => {
  const { data: methodUse } = useGetMethodUseQuery();

  return (
    <Flex vertical>
      <Flex
        className={clsx(styles.search)}
        align="center"
        justify="space-between"
      >
        <Flex vertical>
          <span>
            <b>{item?.nameid}</b>
          </span>
          <span>({item?.form_name})</span>
          <span>{methodUse?.[0]?.nameid}</span>
        </Flex>

        <Flex gap="small" className={clsx(styles.btn)}>
          <Checkbox
            checked={selectedDrugs.some((d) => d.codeid === item.codeid)}
            onChange={() => toggleDrug(item)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
