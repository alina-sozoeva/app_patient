import { useForm } from "antd/es/form/Form";
import { Flex, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useAddDoctorMutation } from "../../store";

import styles from "./LoginPage.module.scss";
import clsx from "clsx";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = useForm();

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
          Авторизация
        </Typography.Title>
        <Form.Item
          name="login"
          label="Логин"
          rules={[
            {
              required: true,
              message: "Это обязательное поле для заполнения!",
            },
          ]}
        >
          <Input placeholder="Введите логин" style={{ width: "250px" }} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            {
              required: true,
              message: "Это обязательное поле для заполнения!",
            },
          ]}
        >
          <Input.Password
            placeholder="Введите пароль"
            style={{ width: "250px" }}
          />
        </Form.Item>
        <Form.Item>
          <Flex align="center" justify="center" className={clsx("w-full")}>
            <button className={clsx(styles.btn)}>Войти</button>
          </Flex>
        </Form.Item>

        <Flex vertical className={clsx(styles.info)}>
          <span>Цифровые решения "Бехруз Софт"</span>
          <span>Номер телефона: +996(555)-954-120</span>
          <span>WhatsApp: +996(555)-954-120</span>
          <span>Почта: admin@333.kg</span>
        </Flex>
      </Form>
    </section>
  );
};
