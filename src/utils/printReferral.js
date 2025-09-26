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

  const html = `
<html>
  <head>
    <title>Выписанное направление</title>
    <style>
      body { 
        font-family: 'Times New Roman', Georgia, serif; 
        padding: 30px; 
        color: #000;
      }
      h1 { 
        font-size: 24px; 
        font-weight: bold;
        margin-bottom: 20px;
      }
      .header {
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 20px;
        font-size: 14px;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
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
    </style>
  </head>
  <body>
    <h1>Выписанное направление</h1>

    <div class="header">
      <div>
        ${findPatient?.fio || "-"}<br/>
       ${dayjs(findPatient?.birth_date).format("DD.MM.YYYY")}
      </div>
      <div>
        Врач: ${user?.nameid || "-"}<br/>
        Дата создания: ${dayjs
          .utc(prescription.created_at)
          .format("DD.MM.YYYY HH:mm")}
      </div>
    </div>

    <div>
      <b>Клиника:</b> ${prescription?.clinicName || "-"}
    </div>

    <table>
      <thead>
        <tr>
          <th>Услуги</th>
        </tr>
      </thead>
      <tbody>
        ${prescription.items
          .map(
            (item) => `
          <tr>
            <td>${item.serviceName || "-"}</td>
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
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};
