import React, { useState } from 'react';
import { Button, Checkbox, Select, Radio, Slider, Modal } from 'antd';
import { FilterOutlined } from '@ant-design/icons';


const { Option } = Select;
const brands = {
    Apple: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    Samsung: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    Mobell: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    Mobel: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    Mobl: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    Mell: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    bell: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    ell: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
    ll: "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg",
}
// const brands = ['Samsung', 'iPhone', 'Oppo', 'Xiaomi', 'Vivo', 'Realme', 'Honor', 'TCL'];
const priceRanges = ['Dưới 2 triệu', 'Từ 2 - 4 triệu', 'Từ 4 - 7 triệu', 'Từ 7 - 13 triệu', 'Từ 13 - 20 triệu', 'Trên 20 triệu'];
const phoneTypes = [
    { name: 'Android', imageUrl: 'https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg' },
    { name: 'iPhone (iOS)', imageUrl: 'https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg' },
];
const needs = ['Chơi game / Cấu hình cao', 'Pin khủng trên 5000 mAh', 'Chụp ảnh, quay phim'];
const ramOptions = ['3 GB', '4 GB', '6 GB', '8 GB', '12 GB'];
const storageOptions = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
const screenResolutions = ['QQVGA', 'QVGA', 'HD+', 'Full HD+', '1.5K', '2K+', 'Retina (iPhone)'];
const refreshRates = ['60 Hz', '90 Hz', '120 Hz', '144 Hz'];
const chargingFeatures = ['Sạc nhanh (từ 20W)', 'Sạc siêu nhanh (từ 60W)', 'Sạc không dây'];
const specialFeatures = ['Kháng nước, bụi', 'Hỗ trợ 5G', 'Bảo mật khuôn mặt 3D', 'Công nghệ NFC'];

const FilterModal = () => {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedPhoneType, setSelectedPhoneType] = useState('');
    const [selectedNeeds, setSelectedNeeds] = useState([]);
    const [selectedRam, setSelectedRam] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedResolution, setSelectedResolution] = useState('');
    const [selectedRefreshRate, setSelectedRefreshRate] = useState('');
    const [selectedCharging, setSelectedCharging] = useState([]);
    const [selectedSpecialFeatures, setSelectedSpecialFeatures] = useState([]);
    const [priceRange, setPriceRange] = useState([300000, 53000000]);

    // Trạng thái của Modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Hiển thị Modal
    const showModal = () => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
    };

    // Đóng Modal
    const handleCancel = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div>
            {/* Nút mở modal */}
            <Button type="primary" onClick={showModal}>
            <FilterOutlined />

            </Button>

            {/* Modal chứa bộ lọc */}
            <Modal
                title="Bộ lọc"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="apply" type="primary">
                        Áp dụng
                    </Button>,
                ]}
                width={800} // bạn có thể điều chỉnh kích thước modal ở đây
                bodyStyle={{ height: '50vh', overflowY: 'auto' }}
            >
                {/* Nội dung bộ lọc */}
                <div className="p-4 bg-white shadow-md rounded-lg">
                    <div className="flex flex-wrap gap-4 mb-4"> {/* Thêm flex-wrap để cho phép các mục xuống dòng */}
                        <h3 className="font-semibold">Hãng</h3>
                        {Object.entries(brands).map(([brand, imageUrl]) => (
                            <div
                                key={brand}
                                onClick={() => {
                                    setSelectedBrands((prevSelected) =>
                                        prevSelected.includes(brand)
                                            ? prevSelected.filter(item => item !== brand) // Nếu đã chọn thì bỏ chọn
                                            : [...prevSelected, brand] // Nếu chưa chọn thì thêm vào
                                    );
                                }}
                                className={`flex items-center cursor-pointer p-2 border rounded-lg ${selectedBrands.includes(brand) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                    }`}
                                style={{ transition: '0.3s', width: 'calc(20% - 16px)' }} // Chiều rộng cho mỗi mục
                            >
                                <img
                                    src={imageUrl}
                                    alt={brand}
                                    style={{ width: '100%', height: 'auto' }} // Thay đổi để phù hợp với chiều rộng
                                />
                            </div>
                        ))}
                    </div>



                    {/* Hàng ngang: Giá, Loại điện thoại, Nhu cầu */}
                    <div className="flex gap-4 mb-4">
                        {/* Giá */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Giá</h3>
                            <Checkbox.Group
                                options={priceRanges}
                                value={selectedPriceRange}
                                onChange={setSelectedPriceRange}
                                className="mt-2"
                            />
                            <div className="mt-4">
                                <Slider
                                    range
                                    min={300000}
                                    max={53000000}
                                    step={100000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                />
                                <div className="flex justify-between mt-2 text-sm">
                                    <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                                    <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        </div>

                        {/* Loại điện thoại */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Loại điện thoại</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {phoneTypes.map((type) => (
                                    <div
                                        key={type.name} // Sử dụng type.name làm key
                                        onClick={() => {
                                            setSelectedPhoneType((prevSelected) =>
                                                prevSelected.includes(type.name) // Kiểm tra xem đã chọn chưa
                                                    ? prevSelected.filter(item => item !== type.name) // Nếu đã chọn thì bỏ chọn
                                                    : [...prevSelected, type.name] // Nếu chưa chọn thì thêm vào
                                            );
                                        }}
                                        className={`flex flex-col items-center cursor-pointer p-2 border rounded-lg ${selectedPhoneType.includes(type.name) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                            }`} // Cập nhật điều kiện để kiểm tra nếu type.name đã được chọn
                                        style={{ transition: '0.3s' }}
                                    >
                                        <img
                                            src={type.imageUrl}
                                            alt={type.name}
                                            style={{ width: '60px', height: '60px', marginBottom: '8px' }}
                                        />
                                        <span>{type.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Nhu cầu */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Nhu cầu</h3>
                            <Checkbox.Group
                                options={needs}
                                value={selectedNeeds}
                                onChange={setSelectedNeeds}
                                className="grid grid-cols-1 gap-2 mt-2"
                            />
                        </div>
                    </div>

                    {/* Hàng ngang: RAM, Tần số quét, Độ phân giải */}
                    <div className="flex gap-4 mb-4">
                        {/* RAM */}
                        <div className="flex-1">
                            <h3 className="font-semibold">RAM</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {ramOptions.map((ram) => (
                                    <Button
                                        key={ram}
                                        type={selectedRam.includes(ram) ? 'primary' : 'default'} // Kiểm tra xem RAM đã được chọn hay chưa
                                        onClick={() => {
                                            if (selectedRam.includes(ram)) {
                                                // Nếu đã chọn, thì bỏ chọn
                                                setSelectedRam(selectedRam.filter((item) => item !== ram));
                                            } else {
                                                // Nếu chưa chọn, thì thêm vào danh sách
                                                setSelectedRam([...selectedRam, ram]);
                                            }
                                        }}
                                        style={{ width: 'auto' }}
                                    >
                                        {ram}
                                    </Button>
                                ))}
                            </div>
                        </div>


                        {/* Tần số quét */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Tần số quét</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {refreshRates.map((rate) => (
                                    <Button
                                        key={rate}
                                        type={selectedRefreshRate.includes(rate) ? 'primary' : 'default'} // Kiểm tra xem tần số quét đã được chọn hay chưa
                                        onClick={() => {
                                            if (selectedRefreshRate.includes(rate)) {
                                                // Nếu đã chọn, thì bỏ chọn
                                                setSelectedRefreshRate(selectedRefreshRate.filter((item) => item !== rate));
                                            } else {
                                                // Nếu chưa chọn, thì thêm vào danh sách
                                                setSelectedRefreshRate([...selectedRefreshRate, rate]);
                                            }
                                        }}
                                        style={{ width: 'auto' }}
                                    >
                                        {rate}
                                    </Button>
                                ))}
                            </div>
                        </div>


                        {/* Độ phân giải */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Độ phân giải</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {screenResolutions.map((resolution) => (
                                    <Button
                                        key={resolution}
                                        type={selectedResolution.includes(resolution) ? 'primary' : 'default'} // Kiểm tra xem độ phân giải đã được chọn hay chưa
                                        onClick={() => {
                                            if (selectedResolution.includes(resolution)) {
                                                // Nếu đã chọn, thì bỏ chọn
                                                setSelectedResolution(selectedResolution.filter((item) => item !== resolution));
                                            } else {
                                                // Nếu chưa chọn, thì thêm vào danh sách
                                                setSelectedResolution([...selectedResolution, resolution]);
                                            }
                                        }}
                                        style={{ width: 'auto' }}
                                    >
                                        {resolution}
                                    </Button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Hàng ngang: Dung lượng lưu trữ, Tính năng sạc, Tính năng đặc biệt */}
                    <div className="flex gap-4 mb-4">
                        {/* Dung lượng lưu trữ */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Dung lượng lưu trữ</h3>
                            <div className="grid grid-cols-3 gap-1 ">
                                {storageOptions.map((storage) => (
                                    <Button
                                        key={storage}
                                        type={selectedStorage.includes(storage) ? 'primary' : 'default'}
                                        onClick={() => {
                                            if (selectedStorage.includes(storage)) {
                                                setSelectedStorage(selectedStorage.filter((item) => item !== storage));
                                            } else {
                                                setSelectedStorage([...selectedStorage, storage]);
                                            }
                                        }}
                                        style={{ width: 'auto' }}
                                    >
                                        {storage}
                                    </Button>
                                ))}
                            </div>
                        </div>


                        {/* Tính năng sạc */}
                        <div className='flex-1'>
                            <h3 className="font-semibold">Tính năng sạc</h3>
                            <Checkbox.Group
                                options={chargingFeatures}
                                value={selectedCharging}
                                onChange={setSelectedCharging}
                                className="grid grid-cols-1 gap-2 mt-2"
                            />

                        </div>
                        {/* Tính năng đặc biệt */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Tính năng đặc biệt</h3>
                            <Checkbox.Group
                                options={specialFeatures}
                                value={selectedSpecialFeatures}
                                onChange={setSelectedSpecialFeatures}
                                className="grid grid-cols-1 gap-2 mt-2"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FilterModal;
