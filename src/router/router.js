import { createBrowserRouter, Outlet } from "react-router-dom";
import * as Pages from "../pages";
import { Header } from "../common";

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
      { path: "/", element: <Pages.HomePage /> },
      { path: "/patients", element: <Pages.PatientsPage /> },
      { path: "/patient/:id", element: <Pages.PatientPage /> },
    ],
  },
]);
