import {
  CaretDownOutlined,
  LeftOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Dropdown, Flex, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { pathname } from "../../enums";
import { useDispatch, useSelector } from "react-redux";
import { users } from "../../data";
import { removeUserId } from "../../store/slices";

import styles from "./Header.module.scss";
import clsx from "clsx";

export const Header = () => {
  const { guid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const userId = useSelector((state) => state.user.userId);
  const findUser = users.find((item) => item.id === +userId);

  const logOut = () => {
    dispatch(removeUserId());
  };

  const items = [
    {
      label: <p>{findUser?.login}</p>,
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <Space onClick={logOut}>
          Выйти <LogoutOutlined rotate={270} />
        </Space>
      ),
      key: "3",
    },
  ];

  const returnNewRx = () => {
    navigate(`/patient/${guid}`);
    localStorage.removeItem("selectedDrugs");
  };

  return (
    <header className={clsx(styles.header)}>
      <section className={clsx(styles.header_content, "container")}>
        {path === pathname.home && (
          <Flex justify="space-between" align="center">
            <MenuOutlined style={{ width: "60px" }} />
            <span>LOGO</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {findUser?.name.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{findUser?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path === pathname.patients && (
          <Flex justify="space-between" align="center">
            <LeftOutlined
              onClick={() => navigate("/")}
              style={{ width: "60px" }}
            />
            <span>Недавние пациенты</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {findUser?.name.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{findUser?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/patient/") && (
          <Flex justify="space-between" align="center">
            <LeftOutlined
              onClick={() => navigate(pathname.patients)}
              style={{ width: "60px" }}
            />
            <span>ПАЦИЕНТ</span>{" "}
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {findUser?.name.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{findUser?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/new-rx/") && (
          <Flex justify="space-between">
            <LeftOutlined
              onClick={() => returnNewRx()}
              style={{ width: "60px" }}
            />
            <span>Создать новый рецепт</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {findUser?.name.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{findUser?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>{" "}
          </Flex>
        )}
        {path.startsWith("/rx-details/") && (
          <Flex justify="space-between" align="center">
            <LeftOutlined
              onClick={() => navigate(`/new-rx/${guid}`)}
              style={{ width: "60px" }}
            />
            <span>Детали</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {findUser?.name.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{findUser?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
      </section>
    </header>
  );
};
