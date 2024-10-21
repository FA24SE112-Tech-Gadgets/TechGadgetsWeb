import React from 'react'

export default function PhoneCard({ product }) {
    return (
        <div className="max-w-xs mx-auto border rounded-lg p-2 text-xs  bg-gray-100 dark:bg-gray-950 dark:text-white">
            <div className="flex justify-between mb-1">
                {product.new && <span className="bg-red-200 text-red-600 px-1 py-0.5 rounded">Mẫu mới</span>}
                {product.installment && <span className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded">Trả góp 0%</span>}
            </div>
            <img
                src={product.image}
                alt={product.name}
                className="w-full mb-2 h-30 transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
            />

            <h2 className="text-sm font-semibold mb-1">{product.name}</h2>
            <div className="flex items-center mb-1">
                <span className="text-xs text-gray-600 mr-1">{product.screenSize}</span>
                <span className="text-xs text-gray-600 bg-gray-200 px-1 py-0.5 rounded">{product.screenType}</span>
            </div>
            <div className="flex space-x-1 mb-1">
                <span className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded">RAM: {product.ram}</span>
                <span className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded">Memory: {product.memory}</span>
            </div>
            <div className="mb-2">
                <h3 className="font-semibold text-xs mb-0.5">Usage</h3>
                <div className="flex space-x-1">
                    {product.usage.map((use, index) => (
                        <span key={index} className="bg-blue-200 text-blue-600 px-1 py-0.5 rounded">
                            {use}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mb-2">
                <h3 className="font-semibold text-xs mb-0.5">Camera Features</h3>
                <div className="flex space-x-1">
                    {product.cameraFeatures.map((feature, index) => (
                        <span key={index} className="bg-green-200 text-green-600 px-1 py-0.5 rounded">
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex space-x-1 mb-2">
                <span className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded">Refresh Rate: {product.refreshRate}</span>
            </div>
            <div className="text-red-600 text-lg font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </div>
        </div>
    );
}