const fakeData = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Apple', // Thêm hãng để phù hợp với bộ lọc
    price: 34990000,
    new: true,
    installment: true,
    screenSize: '6.9"',
    screenResolution: 'Retina (iPhone)', // Thêm độ phân giải
    ram: '8 GB', // Phù hợp với bộ lọc RAM
    memory: '512 GB', // Phù hợp với bộ lọc bộ nhớ
    usage: ['Chụp ảnh đẹp', 'Chơi game'], // Phù hợp với nhu cầu
    cameraFeatures: ['Chụp macro', 'Quay video 4K'],
    refreshRate: '120 Hz', // Phù hợp với bộ lọc tần số quét
    chargingFeatures: ['Sạc nhanh (từ 20W)'], // Tính năng sạc
    specialFeatures: ['Kháng nước, bụi', 'Bảo mật khuôn mặt 3D'] // Tính năng đặc biệt
  },
  {
    id: 2,
    name: 'iPhone 13 Pro Max',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Apple',
    price: 29990000,
    new: true,
    installment: true,
    screenSize: '6.9"',
    screenResolution: 'Full HD+', 
    ram: '6 GB',
    memory: '256 GB',
    usage: ['Chụp ảnh đẹp', 'Chơi game'],
    cameraFeatures: ['Chụp macro', 'Quay video 4K'],
    refreshRate: '120 Hz',
    chargingFeatures: ['Sạc siêu nhanh (từ 60W)'],
    specialFeatures: ['Hỗ trợ 5G', 'Công nghệ NFC']
  },
  {
    id: 3,
    name: 'iPhone 14 Pro Max',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Apple',
    price: 37990000,
    new: true,
    installment: true,
    screenSize: '6.9"',
    screenResolution: '2K+',
    ram: '8 GB',
    memory: '512 GB',
    usage: ['Chụp ảnh đẹp', 'Chơi game'],
    cameraFeatures: ['Chụp macro', 'Quay video 4K'],
    refreshRate: '120 Hz',
    chargingFeatures: ['Sạc không dây'],
    specialFeatures: ['Kháng nước, bụi']
  },
  {
    id: 4,
    name: 'iPhone 15 Pro Max',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Apple',
    price: 40990000,
    new: true,
    installment: true,
    screenSize: '6.9"',
    screenResolution: '1.5K',
    ram: '12 GB',
    memory: '512 GB',
    usage: ['Chơi game', 'Chụp ảnh đẹp'],
    cameraFeatures: ['Chụp macro', 'Quay video 4K'],
    refreshRate: '144 Hz',
    chargingFeatures: ['Sạc nhanh (từ 20W)'],
    specialFeatures: ['Hỗ trợ 5G', 'Công nghệ NFC', 'Kháng nước, bụi']
  },
  {
    id: 5,
    name: 'iPhone 11 Pro Max',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Apple',
    price: 15990000,
    new: true,
    installment: true,
    screenSize: '6.5"',
    screenResolution: 'HD+',
    ram: '4 GB',
    memory: '128 GB',
    usage: ['Chụp ảnh đẹp', 'Chơi game'],
    cameraFeatures: ['Quay video 4K'],
    refreshRate: '90 Hz',
    chargingFeatures: ['Sạc nhanh (từ 20W)'],
    specialFeatures: ['Công nghệ NFC']
  },
  {
    id: 6,
    name: 'Samsung Galaxy S23',
    image: 'https://i5.walmartimages.com/asr/cb8f75e5-1b8e-4c06-9776-0d995a314ada.88ab53492f6fe7e653033585616419b1.jpeg',
    brand: 'Samsung',
    price: 20990000,
    new: true,
    installment: true,
    screenSize: '6.7"',
    screenResolution: '2K+',
    ram: '8 GB',
    memory: '512 GB',
    usage: ['Chụp ảnh đẹp', 'Chơi game'],
    cameraFeatures: ['Chụp macro', 'Quay video 4K'],
    refreshRate: '144 Hz',
    chargingFeatures: ['Sạc nhanh (từ 20W)', 'Sạc không dây'],
    specialFeatures: ['Hỗ trợ 5G', 'Kháng nước, bụi']
  },
];

export default fakeData;
