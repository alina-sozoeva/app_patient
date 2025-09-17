import { useForm } from "antd/es/form/Form";

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
import { useEffect, useState } from "react";

import { useUpdatePatientMutation } from "../../../store";
import ruRU from "antd/locale/ru_RU";
import dayjs from "dayjs";

import styles from "./EditPatientModal.module.scss";
import clsx from "clsx";

export const EditPatientModal = ({ title, open, onCancel, item }) => {
  const [form] = useForm();
  const [updatePatient] = useUpdatePatientMutation();

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

  const onFinish = (values) => {
    updatePatient({
      guid: item?.guid,
      fio: values?.fio,
      birth_date: values.birth_date,
      gender: checkedMan ? 1 : 0,
      pharmacy_id: item?.pharmacy_id,
      phone: values?.phone,
      email: values?.email,
    });
    onCancel();
    form.resetFields();
  };

  const onClose = () => {
    onCancel();
    form.resetFields();
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        guid: item?.guid,
        fio: item?.fio,
        birth_date: item?.birth_date ? dayjs(item.birth_date) : null,
        gender: item?.gender,
        pharmacy_id: item?.pharmacy_id,
        phone: item?.phone,
        email: item?.email,
      });
    }
  }, [form, open, item]);

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
              Изменить
            </button>
          </Flex>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};
