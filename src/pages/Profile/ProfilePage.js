import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import InputMask from 'react-input-mask';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';


const labels = {
  name: 'Tên',
  address: 'Địa chỉ',
  cccd: 'CCCD',
  gender: 'Giới tính',
  dateOfBirth: 'Ngày sinh',
  phoneNumber: 'Số điện thoại',
  email: 'Email',
  avatar: 'Ảnh đại diện'
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    cccd: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await AxiosInterceptor.get('/api/users/current');
        const userData = response.data.customer;
        console.log(response.data);
        setProfile({
          name: userData.fullName,
          address: userData.address || '',
          cccd: userData.cccd || '',
          gender: userData.gender || '',
          dateOfBirth: userData.dateOfBirth || '',
          phoneNumber: userData.phoneNumber || '',
          email: response.data.email,
          avatar: userData.avatarUrl || ''
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary/40 to-secondary/40">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-gray-700">
            <FaPencilAlt />
          </button>
        </div>
        <div className="flex">
          <div className="w-1/3 flex flex-col items-center">
            <img src={profile.avatar} alt="Avatar" className="rounded-full w-40 h-40 mb-4" />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-2 p-2 border rounded w-full h-10"
              />
            ) : (
              <h2 className="text-xl font-bold">{profile.name}</h2>
            )}
            {isEditing && (
              <input
                type="text"
                name="avatar"
                value={profile.avatar}
                onChange={handleChange}
                className="mt-2 p-2 border rounded w-full h-10"
              />
            )}
          </div>
          <div className="w-2/3 ml-8 ">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(profile).map((key) => (
                key !== 'avatar' && key !== 'name' && (
                  <div key={key} className="mb-4">
                    <label className="block text-gray-700">{labels[key]}</label>
                    {isEditing ? (
                      key === 'gender' ? (
                        <select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          className="mt-2 p-2 border rounded w-full h-10"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      ) : key === 'dateOfBirth' ? (
                        <InputMask
                          mask="99/99/9999"
                          value={profile.dateOfBirth}
                          onChange={handleChange}
                        >
                          {(inputProps) => <input {...inputProps} type="text" name="dateOfBirth" className=" mt-2 p-2 border rounded w-full h-10" />}
                        </InputMask>
                      ) : (
                        <input
                          type="text"
                          name={key}
                          value={profile[key]}
                          onChange={handleChange}
                          className="mt-2 p-2 border rounded w-full h-10"
                        />
                      )
                    ) : (
                      <p className="mt-2 p-2 border rounded w-full bg-gray-100 h-10">{profile[key]}</p>
                    )}
                  </div>
                )
              ))}
            </div>
            {isEditing && (
              <div className="flex justify-center">
                <button onClick={handleSave} className="mt-4 bg-black text-white p-2 rounded flex items-center">
                  <FaSave className="mr-2" /> Lưu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;