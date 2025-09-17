import { useForm } from "antd/es/form/Form";

import { Flex, Form, Input, Modal, Typography } from "antd";
import { useEffect } from "react";

import styles from "./EditFrequencyModal.module.scss";
import clsx from "clsx";

import { useUpdatePharmacyMutation } from "../../../store";

export const EditFrequencyModal = ({ title, open, onCancel, item }) => {
  const [form] = useForm();
  const [update] = useUpdatePharmacyMutation();

  const onFinish = (values) => {
    update({
      guid: item?.guid,
      nameid: values?.nameid,
      address: values?.address,
      phone: values?.phone,
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
        nameid: item?.nameid,
        address: item?.address,
        phone: item?.phone,
      });
    }
  }, [form, open, item]);

  return (
    <Modal centered open={open} onCancel={onClose} footer={false} width={300}>
      <Typography.Title level={5}>Редактировать {title}</Typography.Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className={clsx(styles.from)}
      >
        <Form.Item
          label={`Название аптеки`}
          name="nameid"
          rules={[
            {
              required: true,
              message: "Это обязательное поле для заполнения!",
            },
          ]}
        >
          <Input placeholder="Введите названиеО" />
        </Form.Item>
        <Form.Item
          label={`Адресс аптеки`}
          name="address"
          rules={[
            {
              required: true,
              message: "Это обязательное поле для заполнения!",
            },
          ]}
        >
          <Input placeholder="Введите адресс" />
        </Form.Item>

        <Form.Item
          label={`Телефон аптеки`}
          name="phone"
          rules={[
            {
              required: true,
              message: "Это обязательное поле для заполнения!",
            },
          ]}
        >
          <Input placeholder="Введите телефон" />
        </Form.Item>

        <Flex gap="small" justify="center">
          <button type="submit" className={clsx(styles.confirm)}>
            Изменить
          </button>
        </Flex>
      </Form>
    </Modal>
  );
};
