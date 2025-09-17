import { createBrowserRouter, Outlet } from "react-router-dom";
import * as Pages from "../pages";
import { Header } from "../common";
import { pathname } from "../enums";
import { PrivateRoute } from "./PrivateRoute";

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
    path: pathname.login,
    element: <Pages.LoginPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: pathname.home,
        element: (
          <PrivateRoute>
            <Pages.HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: pathname.patients,
        element: (
          <PrivateRoute>
            <Pages.PatientsPage />
          </PrivateRoute>
        ),
      },
      {
        path: pathname.patient,
        element: (
          <PrivateRoute>
            <Pages.PatientPage />
          </PrivateRoute>
        ),
      },
      {
        path: pathname.newRx,
        element: (
          <PrivateRoute>
            <Pages.NewRxPage />
          </PrivateRoute>
        ),
      },
      {
        path: pathname.rxDetails,
        element: (
          <PrivateRoute>
            <Pages.RxDetailsPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
