import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from '~/context/auth/useAuth';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';

const DetailGadgetPage = () => {
    const { isAuthenticated } = useAuth();
    const apiBase = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API + "/"
        : process.env.REACT_APP_PRO_API + "/";
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('specifications');
    const [error, setError] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(''); // State for thumbnail URL

    useEffect(() => {
        const apiClient = isAuthenticated ? AxiosInterceptor : axios;
        const fetchProduct = async () => {
            try {
                console.log("Fetching product with ID:", id);
                const response = await apiClient(`${apiBase}api/gadgets/${id}`);
                console.log("API Response:", response.data);
                setProduct(response.data);
                setThumbnailUrl(response.data.thumbnailUrl); // Set initial thumbnail URL
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Failed to fetch product details.");
            }
        };

        fetchProduct();
    }, [id, isAuthenticated, apiBase]);

    const handleImageClick = (imageUrl) => {
        setThumbnailUrl(imageUrl); // Update thumbnail URL when an image is clicked
    };

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column */}
                <div className="lg:w-2/3">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

                    <div className="mb-6">
                        <img
                            src={thumbnailUrl} // Use the updated thumbnail URL
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>

                    <div className="flex space-x-2 mb-6 overflow-x-auto">
                        {product.gadgetImages && product.gadgetImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name} - Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded-md border border-gray-200 cursor-pointer"
                                onClick={() => handleImageClick(image)} // Add click event
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'specifications' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-gray-600 border-gray-300'}`}
                                onClick={() => setActiveTab('specifications')}
                            >
                                Thông số kỹ thuật
                            </button>
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'review' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'text-gray-600 border-gray-300'}`}
                                onClick={() => setActiveTab('review')}
                            >
                                Bài viết đánh giá
                            </button>
                        </div>
                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                {product.specificationValues &&
                                    product.specificationValues
                                        .sort((a, b) => a.index - b.index)
                                        .map((spec) => (
                                            <div key={spec.id}
                                                className="flex items-start border-b border-gray-200 py-3 last:border-0"
                                            >
                                                <div className="w-1/3 text-gray-600">
                                                    {spec.specificationKey || 'N/A'}
                                                </div>
                                                <div className="w-2/3 font-medium text-gray-900">
                                                    {spec.value || 'N/A'}
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                        )}
                        {activeTab === 'review' && (
                            <div className="space-y-4">
                                {product.gadgetDescriptions &&
                                    product.gadgetDescriptions
                                        .sort((a, b) => a.index - b.index)
                                        .map((desc) => {
                                            const isImageUrl = desc.value.startsWith("http") &&
                                                (desc.value.endsWith(".jpg") ||
                                                    desc.value.endsWith(".jpeg") ||
                                                    desc.value.endsWith(".png"));

                                            return (
                                                <div key={desc.id} className={desc.type === 'BoldText' ? 'font-bold' : ''}>
                                                    {isImageUrl ? (
                                                        <img src={desc.value} alt="Gadget" className="max-w-full h-auto" />
                                                    ) : (
                                                        <div>{desc.value}</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="mb-4">
                            <span className="text-3xl font-bold text-red-600">
                                {product.price.toLocaleString()}₫
                            </span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-200">
                                Mua ngay
                            </button>
                            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                                Mua trả góp
                            </button>
                        </div>

                        <h2 className="text-lg font-semibold">Seller Information</h2>
                        <p>{product.seller?.shopName}</p>
                        <p>{product.seller?.shopAddress}</p>

                        <h2 className="text-lg font-semibold mt-4">Brand</h2>
                        <p>{product.brand?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailGadgetPage;