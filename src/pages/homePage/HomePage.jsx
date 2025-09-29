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
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const acts = [
    {
      key: 1,
      icon: <HiOutlineDocumentText />,
      title: t("home.prescriptions"),
      path: pathname.prescriptions,
    },
    {
      key: 2,
      icon: <HiOutlineClipboardDocumentList />,
      title: t("home.reports"),
      path: pathname.reports,
    },
    {
      key: 3,
      icon: <MedicineBoxOutlined />,
      title: t("home.diagnostics"),
      path: pathname.diagnostics,
    },
    {
      key: 4,
      icon: <HiOutlineBell />,
      title: t("home.notifications"),
      path: pathname.notifications,
    },
  ];

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
          <span>{t("home.newPrescription")}</span>
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
