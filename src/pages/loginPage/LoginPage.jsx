import { useForm } from "antd/es/form/Form";
import { Flex, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useAddDoctorMutation } from "../../store";

import styles from "./LoginPage.module.scss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const { t } = useTranslation();

  const [login] = useAddDoctorMutation();

  const onFinish = async (values) => {
    try {
      await login({
        login: values.login,
        password: values.password,
      }).unwrap();

      navigate("/");
      form.resetFields();
    } catch (error) {
      if (error.status === 401) {
        toast.error("Неверный пароль или логин!");
      } else {
        toast.error("Произошла ошибка, попробуйте позже");
      }
    }
  };

  return (
    <section className={clsx(styles.wrap, "container")}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className={styles.form}
      >
        <Typography.Title level={3} className={styles.formTitle}>
          {t("login.title")}
        </Typography.Title>
        <Form.Item
          name="login"
          label={t("login.username")}
          rules={[
            {
              required: true,
              message: t("form.errorMessage"),
            },
          ]}
        >
          <Input
            placeholder={t("login.enterUsername")}
            style={{ width: "250px" }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("login.password")}
          rules={[
            {
              required: true,
              message: t("form.errorMessage"),
            },
          ]}
        >
          <Input.Password
            placeholder={t("login.enterPassword")}
            style={{ width: "250px" }}
          />
        </Form.Item>
        <Form.Item>
          <Flex align="center" justify="center" className={clsx("w-full")}>
            <button className={clsx(styles.btn)}>{t("login.submit")}</button>
          </Flex>
        </Form.Item>

        <Flex vertical className={clsx(styles.info)}>
          <span>{t("login.company")}</span>
          <span>{t("login.phone")}: +996(555)-954-120</span>
          <span>WhatsApp: +996(555)-954-120</span>
          <span>{t("login.email")}: admin@333.kg</span>
        </Flex>
      </Form>
    </section>
  );
};
