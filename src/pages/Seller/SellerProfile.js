import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaSave, FaKey } from 'react-icons/fa';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import ChangePassword from '~/pages/Profile/ChangePassword';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BankOutlined,
    ShopOutlined,
    HomeOutlined,
    PhoneOutlined,
    MailOutlined,
    BuildOutlined,
    FileTextOutlined,
    TagsOutlined
} from '@ant-design/icons';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const labels = {
    companyName: { text: 'Tên Công Ty', icon: <BankOutlined /> },
    shopName: { text: 'Tên Cửa Hàng', icon: <ShopOutlined /> },
    shopAddress: { text: 'Địa chỉ cửa hàng', icon: <HomeOutlined /> },
    phoneNumber: { text: 'Số điện thoại', icon: <PhoneOutlined /> },
    email: { text: 'Email', icon: <MailOutlined /> },
    businessModel: { text: 'Loại hình kinh doanh', icon: <BuildOutlined /> },
    billingMails: { text: 'Billing Mails', icon: <FileTextOutlined /> },
    taxCode: { text: 'Mã số thuế', icon: <TagsOutlined /> }
};

const SellerProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profile, setProfile] = useState({
        companyName: '',
        shopName: '',
        shopAddress: '',
        phoneNumber: '',
        email: '',
        businessModel: '',
        billingMails: [],
        taxCode: '',
    });
    const [originalProfile, setOriginalProfile] = useState({});

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await AxiosInterceptor.get('/api/seller/current');
                const userData = response.data;

                const loadedProfile = {
                    companyName: userData.companyName || '',
                    shopName: userData.shopName || '',
                    shopAddress: userData.shopAddress || '',
                    phoneNumber: userData.phoneNumber || '',
                    email: userData.user.email || '',
                    businessModel: userData.businessModel || '',
                    billingMails: userData.billingMails || [],
                    taxCode: userData.taxCode || '',
                };

                setProfile(loadedProfile);
                setOriginalProfile(loadedProfile); // Store original data for comparison
            } catch (error) {
                console.error('Error fetching seller profile:', error);
            }
        };

        getCurrentUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();

            // Only add fields that have been modified
            if (profile.companyName !== originalProfile.companyName) formData.append('CompanyName', profile.companyName);
            if (profile.shopName !== originalProfile.shopName) formData.append('ShopName', profile.shopName);
            if (profile.shopAddress !== originalProfile.shopAddress) formData.append('ShopAddress', profile.shopAddress);
            if (profile.phoneNumber !== originalProfile.phoneNumber) formData.append('PhoneNumber', profile.phoneNumber);

            // Skip API call if there are no changes
            if (Array.from(formData.keys()).length === 0) {
                toast.info('Không có thay đổi nào để lưu.');
                return;
            }

            const response = await AxiosInterceptor.patch('/api/seller', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setIsEditing(false);
                setOriginalProfile(profile); // Update original profile after successful save
                toast.success('Cập nhật thông tin thành công!');
            } else {
                const errorMessage = response.data.reasons?.[0]?.message || 'Vui lòng thử lại.';
                toast.error(`${errorMessage}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.reasons?.[0]?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
            toast.error(`${errorMessage}`);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary/40 to-secondary/40">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">              
            <div>
                <button
                   onClick={() => navigate('/seller/Order-management')}
                    className="text-black  cursor-pointer"
                >
                    <ArrowBack /> 
                </button>
            </div> 
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-gray-700 text-xl">
                            <FaPencilAlt />
                        </button>
                    </div>
                    <button onClick={openModal} className="text-gray-500 hover:text-gray-700 text-xl">
                        <FaKey />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {/* Editable Fields */}
                    <div>
                        {/* Conditionally render companyName if businessModel is not Personal */}
                        {profile.businessModel !== 'Personal' && (
                            <div className="mb-4">
                                <label className="flex items-center text-gray-700">
                                    {labels.companyName.icon}
                                    <span className="ml-2">{labels.companyName.text}</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profile.companyName}
                                        onChange={handleChange}
                                        className="mt-2 p-2 border rounded w-full h-10"
                                    />
                                ) : (
                                    <p className="mt-2 p-2 border rounded w-full bg-gray-100 h-10 truncate">
                                        {profile.companyName || 'N/A'}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Other editable fields */}
                        {['shopName', 'shopAddress', 'phoneNumber'].map((key) => (
                            <div key={key} className="mb-4">
                                <label className="flex items-center text-gray-700">
                                    {labels[key].icon}
                                    <span className="ml-2">{labels[key].text}</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name={key}
                                        value={profile[key]}
                                        onChange={handleChange}
                                        className="mt-2 p-2 border rounded w-full h-10"
                                    />
                                ) : (
                                    <p className="mt-2 p-2 border rounded w-full bg-gray-100 h-10 truncate">
                                        {profile[key] || 'N/A'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Non-editable Fields */}
                    <div>
                        {['email', 'businessModel', 'taxCode', 'billingMails'].map((key) => (
                            <div key={key} className="mb-4">
                                <label className="flex items-center text-gray-700">
                                    {labels[key].icon}
                                    <span className="ml-2">{labels[key].text}</span>
                                </label>
                                {key === 'billingMails' ? (
                                    <div className="mt-2 p-2 border rounded bg-gray-100">
                                        {profile.billingMails.length > 0 ? (
                                            profile.billingMails.map((mailObject, index) => (
                                                <div key={index} className="h-10">
                                                    {mailObject.mail}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="h-10">No billing mails</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-2 p-2 border rounded w-full bg-gray-100 h-10 truncate">
                                        {profile[key] || 'N/A'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleSave}
                            className="mt-4 bg-black text-white p-2 rounded flex items-center"
                        >
                            <FaSave className="mr-2" /> Lưu
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <ChangePassword onClose={closeModal} />
                </div>
            )}
        </div>
    );
};

export default SellerProfilePage;
