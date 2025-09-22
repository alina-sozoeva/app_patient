import { Flex } from "antd";
import { useNavigate } from "react-router-dom";

import { pathname } from "../../enums";
import rx from "../../assets/rx.png";

import styles from "./HomePage.module.scss";
import clsx from "clsx";

import {
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
  HiOutlineBell,
} from "react-icons/hi2";

import { MedicineBoxOutlined } from "@ant-design/icons";

const acts = [
  {
    key: 1,
    icon: <HiOutlineDocumentText />,
    title: "Выписанные рецепты",
    path: pathname.prescriptions,
  },
  {
    key: 2,
    icon: <HiOutlineClipboardDocumentList />,
    title: "Отчеты",
    path: pathname.reports,
  },
  {
    key: 3,
    icon: <MedicineBoxOutlined />,
    title: "Диагностика",
    path: pathname.diagnostics,
  },
  {
    key: 4,
    icon: <HiOutlineBell />,
    title: "Уведомления",
    path: pathname.notifications,
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
