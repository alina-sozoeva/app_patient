import { createBrowserRouter, Outlet } from "react-router-dom";
import * as Pages from "../pages";
import { Header } from "../common";
import { pathname } from "../enums";

const Layout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: pathname.home, element: <Pages.HomePage /> },
      { path: pathname.patients, element: <Pages.PatientsPage /> },
      { path: pathname.patient, element: <Pages.PatientPage /> },
      { path: pathname.newRx, element: <Pages.NewRxPage /> },
    ],
  },
]);
