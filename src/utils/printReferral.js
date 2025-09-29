import dayjs from "dayjs";

export const printReferral = ({ prescription, findPatient, user }) => {
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

  const servicesHtml = prescription.items
    .map(
      (item) => `<div>${item.serviceName || "-"} - ${item.price || "-"}</div>`
    )
    .join("");

  const html = `
<html>
  <head>
    <title>Выписанное направление</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 30px;
        color: #000;
        font-size: 14px;
        line-height: 1.4;
      }

      .container {
        border: 2px solid #000;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .clinic-logo {
        max-height: 60px;
        margin-bottom: 10px;
      }

      h1 {
        text-align: center;
        font-size: 22px;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .patient-info, .doctor-info {
        margin-bottom: 15px;
      }

      .info-row {
        margin-bottom: 5px;
      }

      .services {
        margin-top: 15px;
      }

      .footer {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }

      .signature {
        border-top: 1px solid #000;
        width: 200px;
        text-align: center;
        margin-top: 40px;
      }

      @media print {
        body {
          padding: 0;
        }
        .container {
          border: none;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="https://via.placeholder.com/150x50?text=Логотип+клиники" class="clinic-logo" alt="Логотип клиники"/>
      <h1>Направление на услуги</h1>

      <div class="header">
        <div class="patient-info">
          <div class="info-row">${findPatient?.fio || "-"}</div>
          <div class="info-row">${dayjs(findPatient?.birth_date).format(
            "DD.MM.YYYY"
          )}</div>
        </div>
        <div class="doctor-info">
          <div class="info-row"><b>Врач:</b> ${user?.nameid || "-"}</div>
          <div class="info-row"><b>Дата создания:</b> ${dayjs
            .utc(prescription.created_at)
            .format("DD.MM.YYYY HH:mm")}</div>
        </div>
      </div>

      <div class="info-row"><b>Клиника:</b> ${
        prescription?.clinicName || "-"
      }</div>

      <div class="services">
        ${servicesHtml}
      </div>
    </div>
  </body>
</html>
`;

  doc.write(html);
  doc.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};
