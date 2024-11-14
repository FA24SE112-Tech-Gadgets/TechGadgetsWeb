import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateGadget = () => {
    const { gadgetId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [specificationKeys, setSpecificationKeys] = useState([]);
    const [specificationUnits, setSpecificationUnits] = useState({});
    const [gadgetData, setGadgetData] = useState({
        brandId: '',
        name: '',
        price: '',
        thumbnailUrl: null,
        categoryId: '',
        condition: '',
        quantity: '',
        discount: {
            discountPercentage: '',
            discountExpiredDate: '',
        },
        gadgetImages: [],
        gadgetDescriptions: [],
        specificationValues: [],
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [initialGadgetData, setInitialGadgetData] = useState(""); // Added state to store initial data

    useEffect(() => {
        const fetchGadgetData = async () => {
            try {
                const [gadgetResponse, categoriesResponse] = await Promise.all([
                    AxiosInterceptor.get(`/api/gadgets/${gadgetId}`),
                    AxiosInterceptor.get("/api/categories")
                ]);

                const gadget = gadgetResponse.data;
                console.log("gadget ne", gadget);

                const allCategories = categoriesResponse.data.items;


                setCategories(allCategories);

                setGadgetData({
                    ...gadget,
                    categoryId: gadget.category.id,
                    brandId: gadget.brand.id,
                    discount: {
                        discountPercentage: gadget.discountPercentage || '',
                        discountExpiredDate: gadget.discountExpiredDate || '',
                    },
                    gadgetImages: gadget.gadgetImages.map(img => ({
                        id: img.id,
                        image: img.imageUrl
                    })),
                    gadgetDescriptions: gadget.gadgetDescriptions,
                    specificationValues: gadget.specificationValues,
                });
                setThumbnailPreview(gadget.thumbnailUrl);
                setInitialGadgetData({ ...gadget }); // Store initial gadget data
                await fetchBrandsAndSpecs(gadget.category.id);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching gadget data:", error);
                toast.error("Failed to fetch gadget data");
                setIsLoading(false);
            }
        };

        fetchGadgetData();
    }, [gadgetId]);

    const fetchBrandsAndSpecs = async (categoryId) => {
        try {
            const [brandsRes, specKeysRes] = await Promise.all([
                AxiosInterceptor.get(`/api/brands/categories/${categoryId}`),
                AxiosInterceptor.get(`/api/specification-keys/categories/${categoryId}`)
            ]);

            setBrands(brandsRes.data.items);
            setSpecificationKeys(specKeysRes.data.items);

            const units = specKeysRes.data.items.reduce((acc, item) => {
                acc[item.id] = item.specificationUnits;
                return acc;
            }, {});
            setSpecificationUnits(units);
        } catch (error) {
            console.error("Error fetching brands and specifications:", error);
            toast.error("Failed to fetch brands and specifications");
        }
    };

    const handleCategoryChange = async (e) => {
        const newCategoryId = e.target.value;
        setGadgetData(prev => ({ ...prev, categoryId: newCategoryId }));
        await fetchBrandsAndSpecs(newCategoryId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Chia khoa ne', gadgetData);




        try {
            const formData = new FormData();

            // Only append changed fields
            // if (gadgetData.brandId !== initialGadgetData.brandId) {
            formData.append('brandId', gadgetData.brandId);
            console.log('brand ne', gadgetData.brandId);
            // }
            // if (gadgetData.name !== initialGadgetData.name) {
            formData.append('name', gadgetData.name);
            console.log('name ne', gadgetData.name);


            // }
            // if (gadgetData.price !== initialGadgetData.price) {
            formData.append('price', gadgetData.price);
            // }
            // if (gadgetData.categoryId !== initialGadgetData.categoryId) {
            formData.append('categoryId', gadgetData.categoryId);
            console.log('cat ne', gadgetData.categoryId);
            // }
            // if (gadgetData.condition !== initialGadgetData.condition) {
            formData.append('condition', gadgetData.condition);
            // }
            // if (gadgetData.quantity !== initialGadgetData.quantity) {
            formData.append('quantity', gadgetData.quantity);
            // }

            // Handle ThumbnailUrl
            if (gadgetData.thumbnailUrl instanceof File) {
                formData.append('thumbnailUrl', gadgetData.thumbnailUrl);
            }

            gadgetData.gadgetImages.forEach((image, index) => {
                if (image.image instanceof File) {
                    formData.append(`GadgetImages[${index}].image`, image.image);
                } else if (image.id) {
                    formData.append(`GadgetImages[${index}].id`, image.id);
                }
            });

            gadgetData.gadgetDescriptions.forEach((desc, index) => {
                if (desc.id) {
                    formData.append(`GadgetDescriptions[${index}].id`, desc.id);
                }
                formData.append(`GadgetDescriptions[${index}].type`, desc.type);
                if (desc.type === 'Image') {
                    if (desc.file instanceof File) {
                        formData.append(`GadgetDescriptions[${index}].image`, desc.file);
                    } else if (desc.value) {
                        formData.append(`GadgetDescriptions[${index}].value`, desc.value);
                    }
                } else {
                    formData.append(`GadgetDescriptions[${index}].text`, desc.value || ''); // Ensure we always send a value for text
                }
            });

            // Handle specificationValues
            gadgetData.specificationValues.forEach((spec, index) => {
                // if (spec.id) {
                formData.append(`SpecificationValues[${index}].id`, spec?.id);
                // }
                // if (spec.specificationKeyId !== initialGadgetData.specificationValues[index]?.specificationKeyId) {
                formData.append(`SpecificationValues[${index}].specificationKeyId`, spec.specificationKey?.id);
                // }
                // if (spec.specificationUnitId !== initialGadgetData.specificationValues[index]?.specificationUnitId) {
                
                formData.append(`SpecificationValues[${index}].specificationUnitId`, spec.specificationUnit?.id);
                // }
                // if (spec.value !== initialGadgetData.specificationValues[index]?.value) {
                formData.append(`SpecificationValues[${index}].value`, spec?.value);
                // }
            });

            await AxiosInterceptor.put(`/api/gadgets/${gadgetId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Cập nhật sản phẩm thành công!");
            navigate('/all-products');
        } catch (error) {
            console.error("Error updating gadget:", error);
            if (error.response?.data?.reasons?.[0]?.message) {
                toast.error(error.response.data.reasons[0].message);
            } else {
                toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const getSpecificationKeyName = (keyId) => {
        const key = specificationKeys.find(k => k.id === keyId);
        return key ? key.name : '';
    };

    const getSpecKeyOptions = (spec) => {
        const options = specificationKeys.map(key => ({
            value: key.id,
            label: key.name
        }));        

        // if (spec.specificationKey && !options.some(opt => opt.label === spec.specificationKey.name)) {
        //     options.unshift({ value: spec.specificationKey.id, label: spec.specificationKey.name });
        // }
        if (spec.specificationKey && !options.some(opt => opt.value === spec.specificationKey.id)) {
            options.unshift({ value: spec.specificationKey.id, label: spec.specificationKey.name });
          }

        return options;
    };

    const handleSpecKeyChange = (index, newKeyId) => {        
        const newSpecs = [...gadgetData.specificationValues];
        const selectedKey = specificationKeys.find(key => key.id === newKeyId);

        newSpecs[index] = {
            ...newSpecs[index],
            specificationKey: {
                id: newKeyId,
                name: selectedKey?.name || ''
            },
            specificationUnit: null
        };

        setGadgetData(prev => ({ ...prev, specificationValues: newSpecs }));
    };


    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setGadgetData(prev => ({ ...prev, thumbnailUrl: file }));
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGadgetImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setGadgetData(prev => ({
            ...prev,
            gadgetImages: [...prev.gadgetImages, ...files.map(file => ({
                id: null,
                image: file
            }))]
        }));
    };

    const handleGadgetDescriptionChange = (index, field, value) => {
        const newDescriptions = [...gadgetData.gadgetDescriptions];
        if (field === 'type' && value === 'Image') {
            newDescriptions[index] = { ...newDescriptions[index], type: value, value: '', file: null };
        } else {
            newDescriptions[index] = { ...newDescriptions[index], [field]: value || '' };
        }
        setGadgetData(prev => ({ ...prev, gadgetDescriptions: newDescriptions }));
    };

    const handleGadgetDescriptionImageChange = (e, index) => {
        const file = e.target.files?.[0];
        if (file) {
            const newDescriptions = [...gadgetData.gadgetDescriptions];
            newDescriptions[index] = {
                ...newDescriptions[index],
                type: 'Image',
                value: URL.createObjectURL(file),
                file: file // Store the file object for later upload
            };
            setGadgetData(prev => ({ ...prev, gadgetDescriptions: newDescriptions }));
        }
    };

    const handleSpecificationValueChange = (index, field, value) => {
        const newSpecs = [...gadgetData.specificationValues];
        newSpecs[index] = { ...newSpecs[index], [field]: value };
        setGadgetData(prev => ({ ...prev, specificationValues: newSpecs }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            </div>
        );
    }
    console.log('day ne', gadgetData);

    {/* Form Update Gadget */ }
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6">Cập Nhật Sản Phẩm</h2>
            {/* Category */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Danh Mục</label>
                <select
                    value={gadgetData.categoryId}
                    onChange={handleCategoryChange}
                    className="w-full border rounded p-3"
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            {/*Brand */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Thương Hiệu</label>
                <select
                    value={gadgetData.brandId}
                    onChange={(e) => setGadgetData(prev => ({ ...prev, brandId: e.target.value }))}
                    className="w-full border rounded p-3"
                >
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>
            </div>
            {/* Name Gadget*/}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Tên Sản Phẩm</label>
                <input
                    type="text"
                    value={gadgetData.name}
                    onChange={(e) => setGadgetData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded p-3"
                />
            </div>
            {/* Price Gadget*/}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Giá</label>
                <input
                    type="number"
                    value={gadgetData.price}
                    onChange={(e) => setGadgetData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border rounded p-3"
                />
            </div>
            {/* Thumbnail Gadget*/}
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
            {/*Condition */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Tình Trạng</label>
                <input
                    type="text"
                    value={gadgetData.condition}
                    onChange={(e) => setGadgetData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full border rounded p-3"
                />
            </div>
            {/*Quantity */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Số Lượng</label>
                <input
                    type="number"
                    value={gadgetData.quantity}
                    onChange={(e) => setGadgetData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full border rounded p-3"
                />
            </div>
            {/* Gadget Images*/}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Ảnh Sản Phẩm</label>
                <input
                    type="file"
                    multiple
                    onChange={handleGadgetImagesChange}
                    className="w-full border rounded p-3"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {gadgetData.gadgetImages.map((image, index) => (
                        <img key={index} src={image.image instanceof File ? URL.createObjectURL(image.image) : image.image} alt={`Gadget Image ${index + 1}`} className="h-20 w-20 object-cover rounded-md" />
                    ))}
                </div>
            </div>

            {/* Gadget Descriptions */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Mô Tả Sản Phẩm</label>
                {gadgetData.gadgetDescriptions.map((desc, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <select
                            value={desc.type}
                            onChange={(e) => handleGadgetDescriptionChange(index, 'type', e.target.value)}
                            className="w-full border rounded p-3 mb-2"
                        >
                            <option value="Image">Ảnh</option>
                            <option value="NormalText">Văn Bản Thường</option>
                            <option value="BoldText">Văn Bản Đậm</option>
                        </select>
                        {desc.type === 'Image' ? (
                            <div>
                                <input
                                    type="file"
                                    onChange={(e) => handleGadgetDescriptionImageChange(e, index)}
                                    className="w-full border rounded p-3 mb-2"
                                />
                                {desc.value && (
                                    <img
                                        src={desc.value}
                                        alt={`Description ${index + 1}`}
                                        className="mt-2 max-w-full h-auto max-h-40 object-contain"
                                    />
                                )}
                            </div>
                        ) : (
                            <textarea
                                value={desc.value || ''}
                                onChange={(e) => handleGadgetDescriptionChange(index, 'value', e.target.value)}
                                className="w-full border rounded p-3"
                                rows={3}
                                placeholder="Nội dung mô tả"
                            />
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setGadgetData(prev => ({
                        ...prev,
                        gadgetDescriptions: [...prev.gadgetDescriptions, { type: 'NormalText', value: '' }]
                    }))}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                >
                    Thêm Mô Tả
                </button>
            </div>


            {/* Specification Values */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-2">Thông Số Kỹ Thuật</label>
                {gadgetData.specificationValues.map((spec, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Thông Số</label>
                            <select
                                value={spec.specificationKey?.id || ''}
                                onChange={(e) => handleSpecKeyChange(index, e.target.value)}
                                className="w-full border rounded p-3"
                            >
                                <option value="">Chọn Thông Số</option>
                                {getSpecKeyOptions(spec).map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {((spec.specificationKey?.id && specificationUnits[spec.specificationKey.id]?.length > 0) || spec.specificationUnit) && (
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Đơn Vị</label>
                                <select
                                    value={spec.specificationUnit?.id || spec.specificationUnit?.name || ''}
                                    onChange={(e) => {
                                        const newSpecs = [...gadgetData.specificationValues];
                                        newSpecs[index] = {
                                            ...newSpecs[index],
                                            specificationUnit: {
                                                id: e.target.value,
                                                value: e.target.options[e.target.selectedIndex].text || spec.specificationUnit?.name
                                            }
                                        };
                                        setGadgetData(prev => ({ ...prev, specificationValues: newSpecs }));
                                    }}
                                    className="w-full border rounded p-3"
                                >
                                    <option value="">Chọn Đơn Vị</option>
                                    {(specificationUnits[spec.specificationKey.id] || []).map((unit) => (
                                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                                    ))}
                                    {spec.specificationUnit && !specificationUnits[spec.specificationKey.id]?.some(u => u.name === spec.specificationUnit?.name) && (
                                        <option key={spec.specificationUnit?.id} value={spec.specificationUnit?.name}>{spec.specificationUnit?.name}</option>
                                    )}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá Trị</label>
                            <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                    const newSpecs = [...gadgetData.specificationValues];
                                    newSpecs[index] = { ...newSpecs[index], value: e.target.value };
                                    setGadgetData(prev => ({ ...prev, specificationValues: newSpecs }));
                                }}
                                className="w-full border rounded p-3"
                                placeholder="Giá Trị Thông Số"
                            />
                        </div>
                    </div>
                )
                )}
                <button
                    type="button"
                    onClick={() => setGadgetData(prev => ({
                        ...prev,
                        specificationValues: [...prev.specificationValues, { specificationKey: null, specificationUnit: null, value: '' }]
                    }))}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                >
                    Thêm Thông Số
                </button>
            </div>
            {/*Submit button */}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600">
                Cập Nhật Sản Phẩm
            </button>
        </form>
    );
};
export default UpdateGadget;