import {
  Checkbox,
  ConfigProvider,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import styles from "./AddPatientModal.module.scss";
import clsx from "clsx";
import { useAddPatientMutation } from "../../../store";
import { useState } from "react";

import ruRU from "antd/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useNavigate } from "react-router-dom";

dayjs.locale("ru");

export const AddPatientModal = ({ open, onCancel, title }) => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [addPatient] = useAddPatientMutation();

  const [checkedMan, setCheckedMan] = useState(true);
  const [checkedWoman, setCheckedWoman] = useState(false);

  const onCheckedMan = (e) => {
    setCheckedMan(e.target.checked);
    setCheckedWoman(false);
  };

  const onCheckedWoman = (e) => {
    setCheckedWoman(e.target.checked);
    setCheckedMan(false);
  };

  const onFinish = async (values) => {
    try {
      const result = await addPatient({
        fio: values.fio,
        birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
        gender: checkedMan ? 1 : 0,
        phone: values?.phone,
        email: values?.email,
      }).unwrap();

      console.log(result);

      navigate(`/patient/${result.guid}`);

      onCancel();
      form.resetFields();
    } catch (err) {
      console.error(err);
    }
  };

  const onClose = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <ConfigProvider locale={ruRU}>
      <Modal centered open={open} onCancel={onClose} footer={false} width={350}>
        <Typography.Title level={5}>Добавить {title}</Typography.Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className={clsx(styles.from)}
          initialValues={{
            gender: 1,
          }}
        >
          <Form.Item
            label={`ФИО ${title}`}
            name="fio"
            rules={[
              {
                required: true,
                message: "Это обязательное поле для заполнения!",
              },
            ]}
          >
            <Input placeholder="Введите ФИО" />
          </Form.Item>
          <Form.Item
            label="Дата рождения"
            name="birth_date"
            rules={[
              {
                required: true,
                message: "Это обязательное поле для заполнения!",
              },
            ]}
          >
            <DatePicker
              placeholder="Введите дату рождения"
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
            />
          </Form.Item>

          <Form.Item
            label={`Номер телефона ${title}`}
            name="phone"
            rules={[
              {
                required: true,
                message: "Это обязательное поле для заполнения!",
              },
            ]}
          >
            <Input placeholder="Введите ФИО" />
          </Form.Item>

          <Form.Item
            label={`Email ${title}`}
            name="email"
            rules={[
              {
                required: true,
                message: "Это обязательное поле для заполнения!",
              },
            ]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>

          <Form.Item
            label="Пол"
            name="gender"
            rules={[
              {
                required: true,
                message: "Это обязательное поле для заполнения!",
              },
            ]}
          >
            <Flex justify="space-around">
              <Checkbox checked={checkedMan} onChange={onCheckedMan}>
                Мужчина
              </Checkbox>
              <Checkbox checked={checkedWoman} onChange={onCheckedWoman}>
                Женщина
              </Checkbox>
            </Flex>
          </Form.Item>

          <Flex gap="small" justify="center">
            <button type="submit" className={clsx(styles.confirm)}>
              Добавить
            </button>
          </Flex>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
