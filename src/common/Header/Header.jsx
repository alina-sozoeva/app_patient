import {
  CaretDownOutlined,
  LeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Flex, Select, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { pathname } from "../../enums";
import { useDispatch, useSelector } from "react-redux";
import { users } from "../../data";
import { removeUser } from "../../store/slices";

import styles from "./Header.module.scss";
import clsx from "clsx";

export const Header = () => {
  const { guid, codeid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const user = useSelector((state) => state.user.user);
  // const user = users.find((item) => item.id === +userId);

  const logOut = () => {
    dispatch(removeUser());
  };

  console.log(user, "user");

  const items = [
    {
      label: <p>{user?.login}</p>,
      key: "0",
    },

    {
      type: "divider",
    },
    {
      label: (
        <Space onClick={logOut}>
          <LogoutOutlined rotate={270} /> Выйти
        </Space>
      ),
      key: "3",
    },
  ];

  const lang = [
    {
      label: <p>🇷🇺 ru</p>,
      key: "ru",
      emoji: "🇷🇺",
    },

    {
      type: "divider",
    },
    {
      label: <p>🇹🇯 tg</p>,
      key: "tg",
      emoji: "🇹🇯",
    },
  ];

  const returnNewRx = () => {
    navigate(`/patient/${guid}`);
    localStorage.removeItem("selectedDrugs");
  };

  const returnNewReferral = () => {
    navigate(`/diagnostics/${guid}`);
    localStorage.removeItem("selectedClinic");
  };

  return (
    <header className={clsx(styles.header)}>
      <section className={clsx(styles.header_content, "container")}>
        {path === pathname.home && (
          <Flex justify="space-between" align="center">
            <span>LOGO</span>
            {/* <Dropdown menu={{ items: lang }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{lang[0].label}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown> */}
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path === pathname.patients && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate("/")}
            >
              <LeftOutlined style={{ width: "60px" }} />
            </div>

            <span>10 последних пациентов</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/patient/") && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate(pathname.patients)}
            >
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>ПАЦИЕНТ</span>{" "}
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/new-rx/") && (
          <Flex justify="space-between">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => returnNewRx()}
            >
              <LeftOutlined style={{ width: "60px" }} />
            </div>
            <span>Создать новый рецепт</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>{" "}
          </Flex>
        )}
        {path.startsWith("/rx-details/") && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate(`/new-rx/${guid}`)}
            >
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>Детали рецепта</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {(path === pathname.prescriptions ||
          path === pathname.reports ||
          path === pathname.notifications ||
          path === pathname.diagnostics) && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate("/")}
            >
              <LeftOutlined style={{ width: "80px" }} />{" "}
            </div>
            {path === pathname.prescriptions && <span>Выписанные рецепты</span>}
            {path === pathname.reports && <span>Отчет за послений месяц</span>}
            {path === pathname.notifications && <span>Уведомления</span>}
            {path === pathname.diagnostics && <span>Диагностика</span>}

            <span></span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/prescriptions-written/") && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate(`/prescriptions-written`)}
            >
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>Детали рецепта</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}

        {path.startsWith("/diagnostics/") && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate(`/diagnostics`)}
            >
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>ПАЦИЕНТ</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/new-referral/") && (
          <Flex justify="space-between" align="center">
            <div className={clsx(styles.prev_arr)} onClick={returnNewReferral}>
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>Создать новое направление</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
                  </Flex>
                  <CaretDownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Flex>
        )}
        {path.startsWith("/referral-details/") && (
          <Flex justify="space-between" align="center">
            <div
              className={clsx(styles.prev_arr)}
              onClick={() => navigate(`/new-referral/${guid}`)}
            >
              <LeftOutlined style={{ width: "60px" }} />{" "}
            </div>
            <span>Детали направления</span>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <button className={clsx(styles.btn)}>
                    {user?.nameid?.charAt(0)}
                  </button>
                  <Flex vertical gap={4}>
                    <p className={clsx(styles.user_info)}>{user?.login}</p>
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
