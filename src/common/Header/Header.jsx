import {
  CaretDownOutlined,
  LeftOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Flex, Select, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { pathname } from "../../enums";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/slices";

import styles from "./Header.module.scss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const lang = [
  {
    label: <p>🇷🇺 ru</p>,
    key: "ru",
    emoji: "🇷🇺",
    value: "ru",
  },

  {
    label: <p>🇹🇯 tg</p>,
    key: "tg",
    emoji: "🇹🇯",
    value: "tg",
  },
];

export const Header = () => {
  const { guid, codeid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const path = location.pathname;
  const user = useSelector((state) => state.user.user);

  const logOut = () => {
    dispatch(removeUser());
  };

  const returnNewRx = () => {
    navigate(`/patient/${guid}`);
    localStorage.removeItem("selectedDrugs");
  };

  const returnNewReferral = () => {
    navigate(`/diagnostics/${guid}`);
    localStorage.removeItem("selectedClinic");
  };

  const items = [
    {
      label: (
        <Space>
          <UserOutlined /> {user?.login}
        </Space>
      ),
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

  const array = [
    {
      key: 1,
      title: "10 последних пациентов",
      path: pathname.patients,
      navigate: () => navigate("/"),
    },
    {
      key: 2,
      title: "Пациент",
      pathStartsWith: "/patient/",
      navigate: () => navigate(pathname.patients),
    },
    {
      key: 3,
      title: "Создать новый рецепт",
      pathStartsWith: "/new-rx/",
      navigate: () => returnNewRx(),
    },
    {
      key: 4,
      title: "Детали рецепта",
      pathStartsWith: "/rx-details/",
      navigate: () => navigate(`/new-rx/${guid}`),
    },
    {
      key: 5,
      title: "Выписанные рецепты",
      path: pathname.prescriptions,
      navigate: () => navigate("/"),
    },
    {
      key: 6,
      title: "Отчет за послений месяц",
      path: pathname.reports,
      navigate: () => navigate("/"),
    },
    {
      key: 7,
      title: "Уведомления",
      path: pathname.notifications,
      navigate: () => navigate("/"),
    },
    {
      key: 8,
      title: "Диагностика",
      path: pathname.diagnostics,
      navigate: () => navigate("/"),
    },
    {
      key: 9,
      title: "Детали рецепта",
      pathStartsWith: "/prescriptions-written/",
      navigate: () => navigate(pathname.prescriptions),
    },
    {
      key: 10,
      title: "Пациент",
      pathStartsWith: "/diagnostics/",
      navigate: () => navigate(pathname.diagnostics),
    },
    {
      key: 11,
      title: "Создать новое направление",
      pathStartsWith: "/new-referral/",
      navigate: () => returnNewReferral(),
    },
    {
      key: 12,
      title: "Детали направления",
      pathStartsWith: "/referral-details/",
      navigate: () => navigate(`/new-referral/${guid}`),
    },
  ];

  return (
    <header className={clsx(styles.header)}>
      <section className={clsx(styles.header_content, "container")}>
        {path === pathname.home && (
          <Flex justify="space-between" align="center">
            <span>LOGO</span>

            {/* <Select
              defaultValue={"ru"}
              options={lang}
              onChange={(value) => i18n.changeLanguage(value)}
              className={clsx(styles.lang)}
            /> */}

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
        {array.map(
          (item) =>
            (path === item?.path || path.startsWith(item?.pathStartsWith)) && (
              <Flex justify="space-between" align="center">
                <div className={clsx(styles.prev_arr)} onClick={item.navigate}>
                  <LeftOutlined style={{ width: "60px" }} />
                </div>

                <span>{item.title}</span>
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
            )
        )}
      </section>
    </header>
  );
};
