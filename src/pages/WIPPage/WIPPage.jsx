import { Button, Result } from "antd";
import { Link, useNavigate } from "react-router-dom";

export const WIPPage = () => {
  const navigate = useNavigate();

  return (
    <main className="container">
      <Result
        status="403"
        title="В разработке"
        subTitle="Эта страница ещё в процессе разработки."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            На главную
          </Button>
        }
      />
    </main>
  );
};
