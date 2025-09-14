import {
  Checkbox,
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
import dayjs from "dayjs";

export const AddPatientModal = ({ open, onCancel, title, position }) => {
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

  const onFinish = (values) => {
    addPatient({
      fio: values.fio,
      birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
      gender: checkedMan ? 1 : 0,
    });
    onCancel();
    form.resetFields();
  };

  const onClose = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal centered open={open} onCancel={onClose} footer={false} width={300}>
      <Typography.Title level={5}>Добавить {title}</Typography.Title>
      <Form layout="vertical" form={form} onFinish={onFinish}>
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
          />
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
            Подтвердить
          </button>
        </Flex>
      </Form>
    </Modal>
  );
};
