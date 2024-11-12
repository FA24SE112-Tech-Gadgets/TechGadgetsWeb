import React, { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import 'tailwindcss/tailwind.css';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateGadget = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specificationKeys, setSpecificationKeys] = useState([]);
  const [specificationUnits, setSpecificationUnits] = useState({});
  const [gadgetData, setGadgetData] = useState({
    brandId: '',
    name: '',
    price: '',
    thumbnailUrl: '',
    categoryId: '',
    condition: '',
    quantity: '',
    discount: {
      discountPercentage: '',
      discountExpiredDate: null,
    },
    gadgetImages: [],
    gadgetDescriptions: [{ Image:'', Text: '', Type: 'Image' }],
    specificationValues: [{ specificationKeyId: '', specificationUnitId: '', value: '' }],
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [gadgetImagePreviews, setGadgetImagePreviews] = useState([]);
  const [gadgetDescriptionPreviews, setGadgetDescriptionPreviews] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await AxiosInterceptor.get("/api/categories");
        setCategories(categoriesRes.data.items);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch brands when a category is selected
  useEffect(() => {
    if (gadgetData.categoryId) {
      AxiosInterceptor.get(`/api/brands/categories/${gadgetData.categoryId}`)
        .then((res) => {
          setBrands(res.data.items);
        })
        .catch((error) => console.error("Error fetching brands", error));
    }
  }, [gadgetData.categoryId]);

  // Fetch specification keys when a category is selected
  useEffect(() => {
    if (gadgetData.categoryId) {
      AxiosInterceptor.get(`/api/specification-keys/categories/${gadgetData.categoryId}`)
        .then((res) => {
          setSpecificationKeys(res.data.items);
          const units = res.data.items.reduce((acc, item) => {
            acc[item.id] = item.specificationUnits;
            return acc;
          }, {});
          setSpecificationUnits(units);
        })
        .catch((error) => console.error("Error fetching specification keys", error));
    }
  }, [gadgetData.categoryId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate discount fields
    if (gadgetData.discount.discountPercentage || gadgetData.discount.discountExpiredDate) {
      const discountPercentage = parseFloat(gadgetData.discount.discountPercentage);
      const discountExpiredDate = new Date(gadgetData.discount.discountExpiredDate);
      if (!gadgetData.discount.discountPercentage || !gadgetData.discount.discountExpiredDate) {
        toast.error("Both discount percentage and expiration date must be provided");
        return;
      }
      if (discountPercentage <= 0 || discountPercentage > 90) {
        toast.error("Discount percentage must be greater than 0 and less than or equal to 90");
        return;
      }
      if (discountExpiredDate <= new Date()) {
        toast.error("Discount expiration date must be in the future");
        return;
      }
    }

    // Validate gadget descriptions


    // Prepare form data
    const formData = new FormData();
    formData.append('brandId', gadgetData.brandId);
    formData.append('name', gadgetData.name);
    formData.append('price', gadgetData.price);
    formData.append('thumbnailUrl', gadgetData.thumbnailUrl);
    formData.append('categoryId', gadgetData.categoryId);
    formData.append('condition', gadgetData.condition);
    formData.append('quantity', gadgetData.quantity);
    if (gadgetData.discount.discountPercentage && gadgetData.discount.discountExpiredDate) {
      formData.append('discountPercentage', gadgetData.discount.discountPercentage);
      formData.append('discountExpiredDate', gadgetData.discount.discountExpiredDate);
    }
    gadgetData.gadgetImages.forEach((image, index) => {
      formData.append('gadgetImages', image);
    });
    gadgetData.gadgetDescriptions.forEach((desc, index) => {
      if (desc.Type === 'Image') {
        formData.append(`GadgetDescriptions[${index}].Image`, desc.Image);
        formData.append(`GadgetDescriptions[${index}].Text`, '');  // Empty string for image type
      } else {
        formData.append(`GadgetDescriptions[${index}].Image`, '');  // Empty string for text types
        formData.append(`GadgetDescriptions[${index}].Text`, desc.Text);
      }
      formData.append(`GadgetDescriptions[${index}].Type`, desc.Type);
    });
    gadgetData.specificationValues.forEach((spec, index) => {
      formData.append(`specificationValues[${index}][specificationKeyId]`, spec.specificationKeyId);
      formData.append(`specificationValues[${index}][specificationUnitId]`, spec.specificationUnitId);
      formData.append(`specificationValues[${index}][value]`, spec.value);
    });

    console.log("Submitting gadget data:", gadgetData);

    try {
      await AxiosInterceptor.post('/api/gadgets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Tạo sản phẩm thành công!");
      navigate('/all-products');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.reasons) {
        const reasons = error.response.data.reasons;
        if (reasons.length > 0) {
          const reasonMessage = reasons[0].message;
          toast.error(reasonMessage);
        } else {
          toast.error("Thay đổi trạng thái thất bại, vui lòng thử lại");
        }
      }
    }
  };

  // Handle discount date formatting
  const handleDateChange = (date) => {
    setGadgetData((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        discountExpiredDate: date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ss') : null,
      },
    }));
  };

  const handleBrandChange = (e) => {
    const selectedBrand = brands.find(brand => brand.name === e.target.value);
    setGadgetData((prev) => ({
      ...prev,
      brandId: selectedBrand ? selectedBrand.id : '',
    }));
  };

  const handleCategoryChange = (e) => {
    setGadgetData((prev) => ({
      ...prev,
      categoryId: e.target.value,
      brandId: '', // Reset brand when category changes
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGadgetData((prev) => ({ ...prev, thumbnailUrl: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setGadgetData((prev) => ({ ...prev, thumbnailUrl: '' }));
      setThumbnailPreview(null);
    }
  };

  const handleGadgetImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGadgetData((prev) => ({ ...prev, gadgetImages: [...prev.gadgetImages, ...files] }));
    setGadgetImagePreviews((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleGadgetDescriptionImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDescriptions = [...gadgetData.gadgetDescriptions];
      newDescriptions[index].Image = file; // Ensure the file is set in the state
      setGadgetData({ ...gadgetData, gadgetDescriptions: newDescriptions });
      const newPreviews = [...gadgetDescriptionPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setGadgetDescriptionPreviews(newPreviews);
    }
  };

  // Render form
  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg  mx-auto">
    <ToastContainer />
    <h2 className="text-2xl font-bold mb-6">Tạo Sản Phẩm Mới</h2>

    {/* Category Selection */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Danh Mục</label>
      <select
        value={gadgetData.categoryId}
        onChange={handleCategoryChange}
        className="w-full border rounded p-3"
      >
        <option value="">Chọn Danh Mục</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>

    {/* Brand Selection */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Thương Hiệu</label>
      <select
        value={brands.find(brand => brand.id === gadgetData.brandId)?.name || ''}
        onChange={handleBrandChange}
        className="w-full border rounded p-3"
        disabled={!gadgetData.categoryId} // Disable brand selection if no category is selected
      >
        <option value="">Chọn Thương Hiệu</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.name}>{brand.name}</option>
        ))}
      </select>
    </div>

    {/* Name */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Tên Sản Phẩm</label>
      <input
        type="text"
        value={gadgetData.name}
        onChange={(e) => setGadgetData({ ...gadgetData, name: e.target.value })}
        className="w-full border rounded p-3"
      />
    </div>

    {/* Price */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Giá</label>
      <input
        type="number"
        value={gadgetData.price}
        onChange={(e) => setGadgetData({ ...gadgetData, price: e.target.value })}
        className="w-full border rounded p-3"
      />
    </div>

    {/* ThumbnailUrl */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Ảnh Đại Diện</label>
      <input
        type="file"
        onChange={handleThumbnailChange}
        className="w-full border rounded p-3"
      />
      {thumbnailPreview && (
        <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
      )}
    </div>

    {/* Condition */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Tình Trạng</label>
      <input
        type="text"
        value={gadgetData.condition}
        onChange={(e) => setGadgetData({ ...gadgetData, condition: e.target.value })}
        className="w-full border rounded p-3"
      />
    </div>

    {/* Quantity */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Số Lượng</label>
      <input
        type="number"
        value={gadgetData.quantity}
        onChange={(e) => setGadgetData({ ...gadgetData, quantity: e.target.value })}
        className="w-full border rounded p-3"
      />
    </div>

    {/* Discount */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Phần Trăm Giảm Giá</label>
      <input
        type="number"
        value={gadgetData.discount.discountPercentage}
        onChange={(e) => setGadgetData({ ...gadgetData, discount: { ...gadgetData.discount, discountPercentage: e.target.value } })}
        className="w-full border rounded p-3"
      />
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Ngày Hết Hạn Giảm Giá</label>
      <div className="flex items-center">
        <DatePicker
          selected={gadgetData.discount.discountExpiredDate ? new Date(gadgetData.discount.discountExpiredDate) : null}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          className="w-full border rounded p-3"
        />
        <Calendar className="ml-2" />
      </div>
    </div>

    {/* Gadget Images */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Ảnh Sản Phẩm</label>
      <input
        type="file"
        multiple
        onChange={handleGadgetImagesChange}
        className="w-full border rounded p-3"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {gadgetImagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt={`Gadget Image Preview ${index}`} className="h-20 w-20 object-cover rounded-md" />
        ))}
      </div>
    </div>

    {/* Gadget Descriptions */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Mô Tả Sản Phẩm</label>
      {gadgetData.gadgetDescriptions.map((desc, index) => (
        <div key={index} className="mb-4">
          <select
            value={desc.Type}
            onChange={(e) => {
              const newDescriptions = [...gadgetData.gadgetDescriptions];
              newDescriptions[index].Type = e.target.value;
              setGadgetData({ ...gadgetData, gadgetDescriptions: newDescriptions });
            }}
            className="w-full border rounded p-3 mb-2"
          >
            <option value="Image">Ảnh</option>
            <option value="normalText">Văn Bản Thường</option>
            <option value="boldText">Văn Bản Đậm</option>
          </select>
          {desc.Type === 'Image' ? (
            <>
              <input
                type="file"
                onChange={(e) => handleGadgetDescriptionImageChange(e, index)}
                className="w-full border rounded p-3 mb-2"
              />
              {gadgetDescriptionPreviews[index] && (
                <img src={gadgetDescriptionPreviews[index]} alt={`Description Image Preview ${index}`} className="mt-2 h-20 w-20 object-cover rounded-md" />
              )}
            </>
          ) : (
            <input
              type="text"
              value={desc.Text}
              onChange={(e) => {
                const newDescriptions = [...gadgetData.gadgetDescriptions];
                newDescriptions[index].Text = e.target.value;
                setGadgetData({ ...gadgetData, gadgetDescriptions: newDescriptions });
              }}
              className="w-full border rounded p-3"
              placeholder="Mô tả"
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setGadgetData({ ...gadgetData, gadgetDescriptions: [...gadgetData.gadgetDescriptions, { Image: '', Text: '', Type: 'Image' }] })}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
      >
        Thêm Mô Tả
      </button>
    </div>

    {/* Specification Values */}
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Thông Số Kỹ Thuật</label>
      {gadgetData.specificationValues.map((spec, index) => (
        <div key={index} className="mb-4">
          <select
            value={spec.specificationKeyId}
            onChange={(e) => {
              const newSpecs = [...gadgetData.specificationValues];
              newSpecs[index].specificationKeyId = e.target.value;
              newSpecs[index].specificationUnitId = ''; // Reset unit when key changes
              setGadgetData({ ...gadgetData, specificationValues: newSpecs });
            }}
            className="w-full border rounded p-3 mb-2"
          >
            <option value="">Chọn Thông Số</option>
            {specificationKeys.map((key) => (
              <option key={key.id} value={key.id}>{key.name}</option>
            ))}
          </select>
          {specificationUnits[spec.specificationKeyId] && specificationUnits[spec.specificationKeyId].length > 0 && (
            <select
              value={spec.specificationUnitId}
              onChange={(e) => {
                const newSpecs = [...gadgetData.specificationValues];
                newSpecs[index].specificationUnitId = e.target.value;
                setGadgetData({ ...gadgetData, specificationValues: newSpecs });
              }}
              className="w-full border rounded p-3 mb-2"
            >
              <option value="">Chọn Đơn Vị</option>
              {specificationUnits[spec.specificationKeyId].map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={spec.value}
            onChange={(e) => {
              const newSpecs = [...gadgetData.specificationValues];
              newSpecs[index].value = e.target.value;
              setGadgetData({ ...gadgetData, specificationValues: newSpecs });
            }}
            className="w-full border rounded p-3"
            placeholder="Giá Trị Thông Số"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setGadgetData({ ...gadgetData, specificationValues: [...gadgetData.specificationValues, { specificationKeyId: '', specificationUnitId: '', value: '' }] })}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
      >
        Thêm Thông Số
      </button>
    </div>

    {/* Submit Button */}
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600">
      Tạo Sản Phẩm
    </button>
  </form>
);
};


export default CreateGadget;
