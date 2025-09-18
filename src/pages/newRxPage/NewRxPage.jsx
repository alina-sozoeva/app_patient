import { Flex, Input } from "antd";

import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FavoriteItem, SearchItem } from "../../components";

import styles from "./NewRxPage.module.scss";
import clsx from "clsx";

import { useGetDrugQuery } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

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
  const { guid } = useParams();
  const navigate = useNavigate();

  const [favOpen, setFavOpen] = useState(true);
  const [rxsOpen, setRxsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState(
    () => JSON.parse(localStorage.getItem("selectedDrugs")) || []
  );

  const { data: drugs } = useGetDrugQuery();

  const filterDrugs = drugs?.filter((item) =>
    item.nameid.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDrug = (drug) => {
    const exists = selectedDrugs?.find((d) => d.codeid === drug.codeid);
    let updated;

    if (exists) {
      updated = selectedDrugs?.filter((d) => d.codeid !== drug.codeid);
    } else {
      updated = [...selectedDrugs, drug];
    }

    setSelectedDrugs(updated);
    localStorage.setItem("selectedDrugs", JSON.stringify(updated));
  };

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
        {/* <Flex className={clsx(styles.favorite_header)} justify="space-between">
          <span>Шаблоны</span>
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
        )} */}
        <Flex className={clsx(styles.favorite_header)} justify="space-between">
          <span>Медикаменты</span>
          <DownOutlined
            rotate={rxsOpen && 180}
            onClick={() => setRxsOpen(!rxsOpen)}
          />
        </Flex>
        {(rxsOpen || search !== "") && (
          <Flex vertical style={{ maxHeight: "400px", overflowY: "auto" }}>
            {filterDrugs?.map((item) => (
              <SearchItem
                item={item}
                selectedDrugs={selectedDrugs}
                toggleDrug={toggleDrug}
              />
            ))}
          </Flex>
        )}
        <div className={clsx("container", styles.create_btn_wrap)}>
          <button
            disabled={selectedDrugs.length === 0}
            className={clsx(
              selectedDrugs.length === 0
                ? styles.create_btn_dis
                : styles.create_btn
            )}
            onClick={() => navigate(`/rx-details/${guid}`)}
          >
            {selectedDrugs.length === 0 ? (
              <span>Выберете медикамент</span>
            ) : (
              "Продолжить"
            )}
          </button>
        </div>
      </section>
    </main>
  );
};
