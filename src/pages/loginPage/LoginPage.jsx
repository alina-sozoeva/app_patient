import { useForm } from "antd/es/form/Form";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { addUserId } from "../../store/slices";
import { users } from "../../data";
import { toast } from "react-toastify";
import { pathname } from "../../enums";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = useForm();

  const onFinish = async (values) => {
    console.log(values);

    const findUser = users.find(
      (item) =>
        item.login === values.login && +item.password === +values.password
    );

    if (!findUser) {
      return toast.error("Неверный пароль или логин! Попробуйте заново");
    } else {
      dispatch(addUserId(findUser.id));
    }

    form.resetFields();
    navigate(pathname.home);
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
          Авторизоваться
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
          <Input placeholder="Введите логин" />
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
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
        <Form.Item>
          <Flex>
            <button className={clsx(styles.btn)}>Войти</button>
          </Flex>
        </Form.Item>
      </Form>
    </section>
  );
};
