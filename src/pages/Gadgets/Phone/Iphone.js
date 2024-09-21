import React, { useState } from "react";
import { Breadcrumb, Slider, Checkbox, Dropdown, Menu, Button, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import fakeData from "./fakeData";

export default function Iphone() {
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedOptions, setSelectedOptions] = useState({
    memory: [],
    ram: [],
    screenSize: [],
    usage: [],
    screenType: [],
    cameraFeatures: [],
    refreshRate: []
  });

  const [visibleDropdown, setVisibleDropdown] = useState(null); // Quản lý dropdown đang mở
  const [sortOrder, setSortOrder] = useState(null);
  const memoryOptions = ["Trên 512GB", "128GB", "256GB", "32GB", "64GB"];
  const ramOptions = ["4GB-6GB", "8GB-12GB"];
  const screenSizeOptions = ["Trên 6 inch", "Dưới 6 inch"];
  const usageOptions = [
    "Dung lượng lớn", "Cấu hình cao", "Chơi game", "Pin trâu",
    "Chụp ảnh đẹp", "Livestream", "Nhỏ gọn, dễ cầm nắm", "Mỏng nhẹ"
  ];
  const screenTypeOptions = ["Dynamic Island", "Tai thỏ"];
  const cameraFeaturesOptions = [
    "Chụp macro", "Chụp xóa phông", "Chụp góc rộng", "Quay video 4K",
    "Chống rung", "Chụp Zoom xa", "Quay video 8K"
  ];
  const refreshRateOptions = ["60Hz", "120Hz"];

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleOptionChange = (option, category) => {
    setSelectedOptions((prev) => {
      const newOptions = prev[category].includes(option)
        ? prev[category].filter((opt) => opt !== option)
        : [...prev[category], option];

      return { ...prev, [category]: newOptions };
    });
  };
  const filteredProducts = () => {
    return fakeData.filter(product => {
      const memoryMatch = selectedOptions.memory.length > 0
        ? selectedOptions.memory.includes(product.memory)
        : true;
      const ramMatch = selectedOptions.ram.length > 0
        ? selectedOptions.ram.includes(product.ram)
        : true;
      const screenSizeMatch = selectedOptions.screenSize.length > 0
        ? selectedOptions.screenSize.includes(product.screenSize)
        : true;
      const usageMatch = selectedOptions.usage.length > 0
        ? selectedOptions.usage.some(opt => product.usage.includes(opt))
        : true;
      const screenTypeMatch = selectedOptions.screenType.length > 0
        ? selectedOptions.screenType.includes(product.screenType)
        : true;
      const cameraFeaturesMatch = selectedOptions.cameraFeatures.length > 0
        ? selectedOptions.cameraFeatures.some(opt => product.cameraFeatures.includes(opt))
        : true;
      const refreshRateMatch = selectedOptions.refreshRate.length > 0
        ? selectedOptions.refreshRate.includes(product.refreshRate)
        : true;

      return memoryMatch && ramMatch && screenSizeMatch && usageMatch &&
        screenTypeMatch && cameraFeaturesMatch && refreshRateMatch;
    });
  };
  const handleConfirm = (category) => {
    console.log(`Selected for ${category}:`, selectedOptions[category]);
    setVisibleDropdown(null);
  };

  const createDropdown = (title, options, category) => (
    <Dropdown
      overlay={
        <Menu>
          {options.map((option) => (
            <Menu.Item key={option}>
              <Checkbox
                checked={selectedOptions[category].includes(option)}
                onChange={() => handleOptionChange(option, category)}
              >
                {option}
              </Checkbox>
            </Menu.Item>
          ))}
          <Menu.Item>
            <Button type="primary" onClick={() => handleConfirm(category)}>
              Xác nhận
            </Button>
          </Menu.Item>
        </Menu>
      }
      trigger={['click']}
      visible={visibleDropdown === category}
      onVisibleChange={(visible) => setVisibleDropdown(visible ? category : null)}
    >
      <a className={`ant-dropdown-link ${selectedOptions[category].length > 0 ? 'active' : ''}`} onClick={(e) => e.preventDefault()}>
        {title} <DownOutlined />
      </a>
    </Dropdown>
  );
  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedProducts = (products) => {
    if (sortOrder === "asc") {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      return products.sort((a, b) => b.price - a.price);
    }
    return products;
  };

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/gadget">Điện thoại</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Apple</Breadcrumb.Item>
      </Breadcrumb>

      {/* Bộ lọc và Sắp xếp */}
      <div className=" mb-4">
        <h4 className="font-semibold">Tiêu chí:</h4>
        <div className="flex space-x-4">
          <Button>
            {createDropdown("Bộ nhớ trong", memoryOptions, "memory")}
          </Button>
          <Button>
            {createDropdown("Dung lượng RAM", ramOptions, "ram")}

          </Button>
          <Button>

            {createDropdown("Kích thước màn hình", screenSizeOptions, "screenSize")}
          </Button>
          <Button>

            {createDropdown("Nhu cầu sử dụng", usageOptions, "usage")}
          </Button>
          <Button>

            {createDropdown("Kiểu màn hình", screenTypeOptions, "screenType")}
          </Button>
          <Button>

            {createDropdown("Tính năng camera", cameraFeaturesOptions, "cameraFeatures")}
          </Button>
          <Button>

            {createDropdown("Tần số quét", refreshRateOptions, "refreshRate")}
          </Button>
        </div>
        {/* <div className="flex items-center">
          <span className="mr-2">Giá:</span>
          <Slider
            range
            value={priceRange}
            onChange={handlePriceChange}
            min={0}
            max={50000000}
            step={1000000}
            marks={{ 0: '0 VNĐ', 50000000: '50M VNĐ' }}
          />
        </div> */}
        <div className="mb-4">
          <h4 className="font-semibold">Sắp xếp theo:</h4>
          <Button onClick={() => handleSort("asc")} className="mr-2">Giá thấp-cao</Button>
          <Button onClick={() => handleSort("desc")} className="mr-2">Giá cao-thấp</Button>
          <Button className="mr-2">% khuyến mãi hot</Button>
          <Button>Xem nhiều</Button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold">Danh sách iPhone</h1>
        <Row gutter={16}>
          {sortedProducts(filteredProducts()).map((product) => (
            <Col span={4} key={product.id}>
              <Card
                hoverable
                cover={<img src={product.image} alt={product.name} />}
              >
                <Card.Meta title={product.name} description={`Giá: ${product.price} VNĐ`} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
