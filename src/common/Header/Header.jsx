import { MenuOutlined } from "@ant-design/icons";
import { Flex } from "antd";

import logo from "../../assets/iprescribe-logo.svg";

import styles from "./Header.module.scss";
import clsx from "clsx";

export const Header = () => {
  return (
    <header className={clsx(styles.header)}>
      <section className={clsx("container")}>
        <Flex className={clsx(clsx(styles.header_content))}>
          <MenuOutlined className={clsx(styles.header_burger)} />
          <span>LOGO</span>
          {/* <img className={clsx(styles.header_img)} src={logo} alt={logo} /> */}
        </Flex>
      </section>
    </header>
  );
};
