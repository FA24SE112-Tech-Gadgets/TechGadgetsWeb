import React, { useState } from 'react';
import { Button, Checkbox, Slider, Modal } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

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
};

const priceRanges = ['Dưới 10 triệu', 'Từ 10-15 triệu', 'Từ 20-25 triệu', 'Từ 25-30 triệu', 'Trên 30 triệu'];
const demand = [
    { name: 'Gamming', imageUrl: 'https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg' },
    { name: 'Học tập, Văn phòng', imageUrl: 'https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Brands/Apple.jpg' },
];
const screenSize = ['Chơi game', 'Pin khủng trên 5000 mAh', 'Chụp ảnh, quay phim'];
const ramOptions = ['3 GB', '4 GB', '6 GB', '8 GB', '12 GB'];
const storageSSDOptions = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
const scanFrequency = ['QQVGA', 'QVGA', 'HD+', 'Full HD+', '1.5K', '2K+', 'Retina (iPhone)'];
const refreshRates = ['60 Hz', '90 Hz', '120 Hz', '144 Hz'];

// Updated processor options
const intelCoreUltra = ['Intel Core Ultra 7', 'Intel Core Ultra 9'];
const intelCore = ['Intel Core i5', 'Intel Core i7', 'Intel Core i9'];
const AMD = ['AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'];

const FilterLaptopModal = ({ onFilterChange }) => {
    const applyFilters = () => {
        const newFilters = {
            brands: selectedBrands,
            priceRange: priceRange,
            ram: selectedRam,
            storage: selectedStorage,
            refreshRate: selectedRefreshRate,
            resolution: selectedResolution,
            processor: selectedProcessor,
        };
        onFilterChange(newFilters);
        handleCancel(); // Close modal
    };

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedRam, setSelectedRam] = useState('');
    const [selectedDemand, setSelectedDemand] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedResolution, setSelectedResolution] = useState('');
    const [selectedRefreshRate, setSelectedRefreshRate] = useState('');
    const [selectedProcessor, setSelectedProcessor] = useState([]);
    const [priceRange, setPriceRange] = useState([300000, 53000000]);

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Show modal
    const showModal = () => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
    };

    // Hide modal
    const handleCancel = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div>
            {/* Button to open modal */}
            <Button type="primary" onClick={showModal}>
                <FilterOutlined /> Bộ lọc
            </Button>

            {/* Modal for filters */}
            <Modal
                title="Bộ lọc"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="apply" type="primary" onClick={applyFilters}>
                        Áp dụng
                    </Button>,
                ]}
                width={800} // Adjust modal width here
                bodyStyle={{ height: '50vh', overflowY: 'auto' }}
            >
                {/* Modal content */}
                <div className="p-4 bg-white shadow-md rounded-lg">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <h3 className="font-semibold">Hãng</h3>
                        {Object.entries(brands).map(([brand, imageUrl]) => (
                            <div
                                key={brand}
                                onClick={() => {
                                    setSelectedBrands((prevSelected) =>
                                        prevSelected.includes(brand)
                                            ? prevSelected.filter(item => item !== brand)
                                            : [...prevSelected, brand]
                                    );
                                }}
                                className={`flex items-center cursor-pointer p-2 border rounded-lg ${selectedBrands.includes(brand) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                    }`}
                                style={{ transition: '0.3s', width: 'calc(20% - 16px)' }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={brand}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Price, RAM, Storage, etc. */}
                    <div className="flex gap-4 mb-4">
                        {/* Price */}
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


                        {/* nhu cầu sử dụng */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Nhu cầu sử dụng</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {demand.map((demand) => (
                                    <div
                                        key={demand.name} // Sử dụng type.name làm key
                                        onClick={() => {
                                            setSelectedDemand((prevSelected) =>
                                                prevSelected.includes(demand.name) // Kiểm tra xem đã chọn chưa
                                                    ? prevSelected.filter(item => item !== demand.name) // Nếu đã chọn thì bỏ chọn
                                                    : [...prevSelected, demand.name] // Nếu chưa chọn thì thêm vào
                                            );
                                        }}
                                        className={`flex flex-col items-center cursor-pointer p-2 border rounded-lg ${selectedDemand.includes(demand.name) ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                                            }`}
                                        style={{ transition: '0.3s' }}
                                    >
                                        <img
                                            src={demand.imageUrl}
                                            alt={demand.name}
                                            style={{ width: '60px', height: '60px', marginBottom: '8px' }}
                                        />
                                        <span>{demand.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Storage */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Dung lượng lưu trữ</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {storageSSDOptions.map((storage) => (
                                    <Button
                                        key={storage} // Unique key for each storage option
                                        type={selectedStorage.includes(storage) ? 'primary' : 'default'} // Check if selected
                                        onClick={() => {
                                            if (selectedStorage.includes(storage)) {
                                                // Deselect if already selected
                                                setSelectedStorage(selectedStorage.filter(item => item !== storage));
                                            } else {
                                                // Select if not selected yet
                                                setSelectedStorage([...selectedStorage, storage]);
                                            }
                                        }}
                                        style={{ width: 'auto' }} // Auto width for buttons
                                    >
                                        {storage}
                                    </Button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Screen Resolution, Refresh Rate, etc. */}
                    <div className="flex gap-4 mb-4">
                        {/* Screen Resolution */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Độ phân giải màn hình</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {scanFrequency.map((resolution) => (
                                    <Button
                                        key={resolution} // Unique key for each resolution
                                        type={selectedResolution.includes(resolution) ? 'primary' : 'default'} // Check if selected
                                        onClick={() => {
                                            if (selectedResolution.includes(resolution)) {
                                                // Deselect if already selected
                                                setSelectedResolution(selectedResolution.filter(item => item !== resolution));
                                            } else {
                                                // Select if not selected yet
                                                setSelectedResolution([...selectedResolution, resolution]);
                                            }
                                        }}
                                        style={{ width: 'auto' }} // Auto width for buttons
                                    >
                                        {resolution}
                                    </Button>
                                ))}
                            </div>
                        </div>



                        {/* Refresh Rate */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Tần số quét</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {refreshRates.map((rate) => (
                                    <Button
                                        key={rate} // Unique key for each refresh rate
                                        type={selectedRefreshRate.includes(rate) ? 'primary' : 'default'} // Check if selected
                                        onClick={() => {
                                            if (selectedRefreshRate.includes(rate)) {
                                                // Deselect if already selected
                                                setSelectedRefreshRate(selectedRefreshRate.filter((item) => item !== rate));
                                            } else {
                                                // Select if not selected yet
                                                setSelectedRefreshRate([...selectedRefreshRate, rate]);
                                            }
                                        }}
                                        style={{ width: 'auto' }} // Auto width for buttons
                                    >
                                        {rate}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* RAM */}
                        <div className="flex-1">
                            <h3 className="font-semibold">RAM</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {ramOptions.map((ram) => (
                                    <Button
                                        key={ram} // Unique key for each RAM option
                                        type={selectedRam.includes(ram) ? 'primary' : 'default'} // Check if selected
                                        onClick={() => {
                                            if (selectedRam.includes(ram)) {
                                                // Deselect if already selected
                                                setSelectedRam(selectedRam.filter((item) => item !== ram));
                                            } else {
                                                // Select if not selected yet
                                                setSelectedRam([...selectedRam, ram]);
                                            }
                                        }}
                                        style={{ width: 'auto' }} // Auto width for buttons
                                    >
                                        {ram}
                                    </Button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Processor options */}
                    <div className="flex gap-4 mb-4">
                        {/* Intel Core Ultra */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Intel Core Ultra</h3>
                            <Checkbox.Group
                                options={intelCoreUltra}
                                value={selectedProcessor}
                                onChange={setSelectedProcessor}
                                className="mt-2"
                            />
                        </div>

                        {/* Intel Core */}
                        <div className="flex-1">
                            <h3 className="font-semibold">Intel Core</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {intelCore.map((processor) => (
                                    <Button
                                        key={processor} // Unique key for each processor option
                                        type={selectedProcessor.includes(processor) ? 'primary' : 'default'} // Check if selected
                                        onClick={() => {
                                            if (selectedProcessor.includes(processor)) {
                                                // Deselect if already selected
                                                setSelectedProcessor(selectedProcessor.filter(item => item !== processor));
                                            } else {
                                                // Select if not selected yet
                                                setSelectedProcessor([...selectedProcessor, processor]);
                                            }
                                        }}
                                        style={{ width: 'auto' }} // Auto width for buttons
                                    >
                                        {processor}
                                    </Button>
                                ))}
                            </div>
                        </div>


                        {/* AMD */}
                        <div className="flex-1">
                            <h3 className="font-semibold">AMD</h3>
                            <Checkbox.Group
                                options={AMD}
                                value={selectedProcessor}
                                onChange={setSelectedProcessor}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FilterLaptopModal;
