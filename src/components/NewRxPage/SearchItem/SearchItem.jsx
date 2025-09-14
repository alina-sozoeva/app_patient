import { Flex } from "antd";

import { CaretUpOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";

import styles from "./SearchItem.module.scss";
import clsx from "clsx";
import { useGetDoseQuery, useGetMethodUseQuery } from "../../../store";
import { useNavigate, useParams } from "react-router-dom";

export const SearchItem = ({ item, drug_id }) => {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { data: doses, isLoading } = useGetDoseQuery();
  const { data: methodUse } = useGetMethodUseQuery();

  const onNavigate = (dose_id) => {
    navigate(`/rx-details/${guid}/${dose_id}/${drug_id}`);
  };

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
          <span>u</span>
          <button onClick={() => setOpen(!open)}>
            <span>{doses?.length}</span>
            <CaretUpOutlined />
          </button>
        </Flex>
      </Flex>
      {open && (
        <Flex gap="middle" vertical className={styles.strength}>
          {doses?.map((i) => (
            <Flex
              justify="space-between"
              key={i?.codeid}
              onClick={() => onNavigate(i?.codeid)}
            >
              <span>{i?.nameid} u</span>
              <RightOutlined />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
