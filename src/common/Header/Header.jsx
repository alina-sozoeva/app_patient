import { LeftOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Flex, Input } from "antd";

import logo from "../../assets/iprescribe-logo.svg";

import styles from "./Header.module.scss";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  return (
    <header className={clsx(styles.header)}>
      <section className={clsx(styles.header_content, "container")}>
        {pathname === "/" && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <MenuOutlined className={clsx(styles.header_burger)} />
            <span>LOGO</span>
            {/* <img className={clsx(styles.header_img)} src={logo} alt={logo} /> */}
          </Flex>
        )}
        {pathname === "/patients" && (
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
        {pathname.startsWith("/patient/") && (
          <Flex className={clsx(clsx(styles.header_info))}>
            <LeftOutlined
              className={clsx(styles.header_arr_orher)}
              onClick={() => navigate("/patients")}
            />
            <span>ПАЦИЕНТ</span>
          </Flex>
        )}
      </section>
    </header>
  );
};
