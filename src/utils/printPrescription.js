import QRCode from "qrcode";
import dayjs from "dayjs";

export const printPrescription = async ({
  prescription,
  findPatient,
  findUser,
}) => {
  let iframe = document.getElementById("print-iframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.id = "print-iframe";
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();

  const qrData = `/patient/${findPatient?.codeid}/${prescription?.prescription_codeid}`;
  const qrUrl = await QRCode.toDataURL(qrData);

  let html = `
<html>
  <head>
    <title>Рецепт</title>
    <style>
      body { 
        font-family: 'Times New Roman', Georgia, serif; 
        padding: 30px; 
        color: #000;
      }
      h1, h2 { 
        text-align: center; 
        margin: 0;
      }
      h2 { 
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: normal;
      }
      .header {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 30px;
      }
      .header div {
        font-size: 14px;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-bottom: 30px;
        font-size: 14px;
      }
      th, td { 
        border: 1px solid #000; 
        padding: 6px 10px; 
        text-align: left;
      }
      th { 
        background-color: #f0f0f0; 
      }
      .qr {
        text-align: center; 
        margin-top: 20px;
      }
      .qr img {
        width: 120px; 
        height: 120px;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
        color: #555;
      }
    </style>
  </head>
  <body>
  <h1 style="font-size: 24px; font-weight: bold; text-align: left; margin-bottom: 20px;">LOGO</h1>

    <h1>РЕЦЕПТ</h1>

    <div class="header">
      <div>
        <p><strong>Пациент:</strong> ${findPatient?.fio}</p>
        <p><strong>Дата рождения:</strong> ${dayjs(
          findPatient?.birth_date
        ).format("DD.MM.YYYY")}</p>
      </div>
      <div>
        <p><strong>Врач:</strong> ${findUser?.name || "-"}</p>
        <p><strong>Дата создания:</strong> ${dayjs
          .utc(prescription.created_at)
          .format("DD.MM.YYYY HH:mm")}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Лекарство</th>
          <th>Форма</th>
          <th>Приём</th>
          <th>Курс (дни)</th>
        </tr>
      </thead>
      <tbody>
        ${prescription.items
          .map(
            (item) => `
          <tr>
            <td>${item.drugName} ${item.doseName}</td>
            <td>${item.form_name || "-"}</td>
            <td>
              ${item.time_before_food ? "до еды " : ""}
              ${item.time_during_food ? "во время еды " : ""}
              ${item.time_after_food ? "после еды" : ""}
            </td>
            <td>${item.courseName}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="qr">
      <img src="${qrUrl}" />
      <p>Отсканируйте QR-код для получения рецепта</p>
    </div>

    <div class="footer">
      Документ сформирован автоматически
    </div>
  </body>
</html>
`;

  doc.write(html);
  doc.close();

  const images = doc.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = img.onerror = resolve;
        })
    )
  );

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};
