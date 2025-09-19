import { Flex } from "antd";
import { useNavigate } from "react-router-dom";

import rx from "../../assets/rx.png";

import styles from "./HomePage.module.scss";
import clsx from "clsx";
import { pathname } from "../../enums";

import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
  HiOutlineBell,
  HiOutlineBeaker,
} from "react-icons/hi2";

const acts = [
  {
    key: 1,
    icon: <HiOutlineDocumentText />,
    title: "Выписанные рецепты",
    path: "/written",
  },
  {
    key: 2,
    icon: <HiOutlineClipboardDocumentList />,
    title: "Отчеты",
    path: "/reports",
  },
  {
    key: 3,
    icon: <HiOutlineBell />,
    title: "Уведомления",
    path: "/notifications",
  },
  {
    key: 4,
    icon: <HiOutlineBeaker />,
    title: "ПДМП",
    path: "/other",
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
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.title}</span>
          </Flex>
        ))}
      </div>
    </main>
  );
};
