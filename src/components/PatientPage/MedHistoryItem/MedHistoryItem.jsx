import { Flex } from "antd";

import QRCode from "qrcode";

import styles from "./MedHistoryItem.module.scss";
import clsx from "clsx";

export const MedHistoryItem = ({ items }) => {
  // const handlePrint = async () => {
  //   let qrData = Math.random().toString(36).substring(2, 10);
  //   const qrUrl = await QRCode.toDataURL(qrData);

  //   let iframe = document.getElementById("print-iframe");
  //   if (!iframe) {
  //     iframe = document.createElement("iframe");
  //     iframe.style.position = "fixed";
  //     iframe.style.right = "0";
  //     iframe.style.bottom = "0";
  //     iframe.style.width = "0";
  //     iframe.style.height = "0";
  //     iframe.style.border = "0";
  //     iframe.id = "print-iframe";
  //     document.body.appendChild(iframe);
  //   }

  //   const doc = iframe.contentWindow.document;
  //   doc.open();
  //   doc.write(`
  //   <html>
  //     <head>
  //       <title>Печать рецепта</title>
  //       <style>
  //         body { font-family: Arial, sans-serif; padding: 20px; }
  //         b { font-weight: bold; }
  //         p { margin: 5px 0; }
  //         img { margin-top: 20px; width: 150px; height: 150px; }
  //       </style>
  //     </head>
  //     <body>
  //       <h2>Рецепт пациента</h2>
  //       <p><b>Лекарство:</b> ${item?.drugName} ${item?.doseName} (${
  //     item?.form_name
  //   })</p>
  //       <p><b>Частота:</b> ${item?.frequencyName}</p>
  //       <p><b>Прием:</b> ${item?.time_after_food ? "после еды" : ""} ${
  //     item?.time_before_food ? "до еды" : ""
  //   } ${item?.time_during_food ? "во время еды" : ""}</p>
  //       <p>Замена разрешена</p>
  //       <img src="${qrUrl}" />
  //     </body>
  //   </html>
  // `);
  //   doc.close();

  //   const images = doc.querySelectorAll("img");
  //   await Promise.all(
  //     Array.from(images).map(
  //       (img) =>
  //         new Promise((resolve) => {
  //           if (img.complete) resolve();
  //           else img.onload = img.onerror = resolve;
  //         })
  //     )
  //   );

  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  // };

  return (
    <>
      {items?.map((item) => (
        <Flex className={clsx(styles.item)} justify="space-between">
          <Flex vertical>
            <span>
              <b>
                {item?.drugName} {item?.doseName} ({item?.form_name})
              </b>
            </span>
            {/* <Flex>
          <span>
            <b>Дата начала:</b> 31/06/2023 {item?.start_date}
          </span>
        </Flex> */}
            {/* <Flex>
          <span>
            <b>Принимать:</b> {item?.time_after_food && "после еды"}
            {item?.time_before_food && "до обеда"}
            {item?.time_during_food && "во время еды"}
          </span>
        </Flex> */}
          </Flex>
        </Flex>
      ))}
    </>
  );
};
