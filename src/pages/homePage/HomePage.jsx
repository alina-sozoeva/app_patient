import { useState } from "react";

import { Flex } from "antd";
import { RiFileEditLine } from "react-icons/ri";
import { BsStopwatch } from "react-icons/bs";
import { FaArrowRotateRight } from "react-icons/fa6";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { GiMedicines } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import rx from "../../assets/rx.png";

import styles from "./HomePage.module.scss";
import clsx from "clsx";
import { pathname } from "../../enums";

const acts = [
  {
    key: 1,
    icon: <BsStopwatch />,
    title: "Ожидание приема",
    gender: "male",
  },
  {
    key: 2,
    icon: <FaArrowRotateRight />,
    title: "Продление",
    gender: "male",
  },
  {
    key: 3,
    icon: <HiOutlineChatAlt2 />,
    title: "Безопасный чат",
    gender: "male",
  },
  {
    key: 4,
    icon: <GiMedicines />,
    title: "ПДМП",
    gender: "male",
  },
];

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className={clsx(styles.main, "container")}>
        <Flex
          vertical
          justify="center"
          align="center"
          className={clsx(styles.new_rx)}
          onClick={() => navigate(pathname.patients)}
        >
          <img src={rx} alt={rx} />
          <span>Новый рецепт</span>
        </Flex>
      </div>
      <div className={clsx(styles.actions, "container")}>
        {acts.map((item) => (
          <Flex
            vertical
            key={item.key}
            align="center"
            justify="center"
            gap="middle"
            className={clsx(styles.act)}
          >
            {item.icon}
            <span>{item.title}</span>
          </Flex>
        ))}
      </div>
    </main>
  );
};
