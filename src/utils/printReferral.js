import QRCode from "qrcode";
import dayjs from "dayjs";

export const printReferral = async ({
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
    <title>Выписанный рецепт</title>
    <style>
      body { 
        font-family: 'Times New Roman', Georgia, serif; 
        padding: 30px; 
        color: #000;
      }
      h1 { 
        font-size: 24px; 
        font-weight: bold;
        text-align: left;
        margin-bottom: 20px;
      }
      .top-line {
        display: flex; 
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }
      .top-line .qr {
        text-align: center;
        font-size: 10px;
        width: 120px;
      }
      .top-line .qr img {
        width: 120px; 
        height: 120px;
        display: block;
        margin-bottom: 4px;
      }
      .top-line .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 14px;
        font-weight: bold;
      }
      .header {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 30px;
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
      .footer {
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
        color: #555;
      }
    </style>
  </head>
  <body>

    <div class="top-line">
      <div class="qr">
        <img src="${qrUrl}" />
        <div>Отсканируйте QR-код для получения рецепта</div>
      </div>
      <div class="right">
        <div>LOGO</div>
        <div>Лицензия</div>
      </div>
    </div>

    <h1>Выписанный рецепт</h1>

    <div class="header">
      <div>
        ${findPatient?.fio || "-"}<br/>
        ${dayjs(findPatient?.birth_date).format("DD.MM.YYYY")}
      </div>
      <div>
        ${findUser?.name || "-"}<br/>
        ${dayjs.utc(prescription.created_at).format("DD.MM.YYYY HH:mm")}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Медикаменты</th>
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
