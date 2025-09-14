import { Flex, Input } from "antd";

import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FavoriteItem, SearchItem } from "../../components";

import styles from "./NewRxPage.module.scss";
import clsx from "clsx";

import { useGetDrugQuery } from "../../store";

const rxsFav = [
  {
    id: 1,
    name: "Метформин",
    strength: "500 мг",
    description: "2 раза в день",
    time: "утром и вечером",
  },
  {
    id: 2,
    name: "Ибупрофен",
    strength: "200 мг",
    description: "по необходимости, до 3 раз в день",
    time: "после еды",
  },
];

export const NewRxPage = () => {
  const [favOpen, setFavOpen] = useState(true);
  const [rxsOpen, setRxsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: drugs } = useGetDrugQuery();

  return (
    <main>
      <section className={clsx(styles.main, "container")}>
        <Flex
          className={clsx(styles.patient_header)}
          justify="space-between"
          align="center"
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Найти новое лекарство"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Flex>
        <Flex className={clsx(styles.favorite_header)} justify="space-between">
          <span>Избранное</span>
          <DownOutlined
            rotate={favOpen && 180}
            onClick={() => setFavOpen(!favOpen)}
          />
        </Flex>
        {favOpen && (
          <Flex vertical>
            {rxsFav.map((item) => (
              <FavoriteItem item={item} />
            ))}
          </Flex>
        )}
        <Flex className={clsx(styles.favorite_header)} justify="space-between">
          <span>Препараты</span>
          <DownOutlined
            rotate={rxsOpen && 180}
            onClick={() => setRxsOpen(!rxsOpen)}
          />
        </Flex>
        {(rxsOpen || search !== "") && (
          <Flex vertical>
            {drugs
              .filter((item) =>
                item.nameid.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <SearchItem item={item} drug_id={item.codeid} />
              ))}
          </Flex>
        )}
      </section>
    </main>
  );
};
