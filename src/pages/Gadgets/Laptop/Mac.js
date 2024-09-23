import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export default function Mac() {
  return (
    <div style={{ padding: "16px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link to="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/gadget">Laptop</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Apple</Breadcrumb.Item>
      </Breadcrumb>

      {/* Main Content */}
      <div>
        <h1>Mac Page</h1>
        <p>Welcome to the Mac gadgets page!</p>
      </div>
    </div>
  );
}
