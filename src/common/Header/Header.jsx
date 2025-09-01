import {
  HomeOutlined,
  LeftOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Flex, Input } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/iprescribe-logo.svg";

import styles from "./Header.module.scss";
import clsx from "clsx";
import { pathname } from "../../enums";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <header className={clsx(styles.header)}>
      <section className={clsx(styles.header_content, "container")}>
        {path === pathname.home && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <MenuOutlined className={clsx(styles.header_burger)} />
            <span>LOGO</span>
            {/* <img className={clsx(styles.header_img)} src={logo} alt={logo} /> */}
          </Flex>
        )}
        {path === pathname.patients && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <LeftOutlined
              className={clsx(styles.header_arr)}
              onClick={() => navigate("/")}
            />

            <Input
              prefix={<SearchOutlined />}
              placeholder="Введите ФИО пациента"
            />
          </Flex>
        )}
        {path.startsWith("/patient/") && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <LeftOutlined
              className={clsx(styles.header_arr_orher)}
              onClick={() => navigate(pathname.patients)}
            />
            <span>ПАЦИЕНТ</span>
          </Flex>
        )}
        {path.startsWith("/new-rx/") && (
          <Flex justify="space-between">
            <LeftOutlined onClick={() => navigate(pathname.patients)} />
            <span>Создать новый рецепт</span>
            <HomeOutlined onClick={() => navigate(pathname.home)} />
          </Flex>
        )}
        {path.startsWith("/rx-details/") && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <LeftOutlined
              className={clsx(styles.header_arr_orher)}
              onClick={() => navigate(pathname.patients)}
            />
            <span>Детали</span>
          </Flex>
        )}
      </section>
    </header>
  );
};
