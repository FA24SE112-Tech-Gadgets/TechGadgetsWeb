import React from "react";

const OrderTable = ({ orders }) => {
  // Group orders by seller
  const ordersBySeller = orders.reduce((acc, order) => {
    const { shopName } = order.sellerInfo;
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(order);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto">
      {Object.keys(ordersBySeller).map((shopName) => (
        <div key={shopName} className="mb-8 border border-gray-200 p-4 rounded-lg">
          {/* Seller Info Header */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">{shopName}</h2>
            <p className="text-gray-600">{ordersBySeller[shopName][0].sellerInfo.shopAddress}</p>
          </div>

          {/* Orders Table for each seller */}
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Products</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Order Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersBySeller[shopName].map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  {/* Products Column */}
                  <td className="py-2 px-4 border-b">
                    {order.gadgets.map((gadget) => (
                      <div
                        key={gadget.sellerOrderItemId}
                        className="flex items-center space-x-4 py-2"
                      >
                        <img
                          src={gadget.thumbnailUrl}
                          alt={gadget.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div>
                          <p className="font-semibold">{gadget.name}</p>
                          <p className="text-gray-600">
                            {gadget.quantity} x {gadget.price.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>

                  {/* Total Amount Column */}
                  <td className="py-2 px-4 border-b">{order.amount.toLocaleString()}đ</td>

                  {/* Status Column */}
                  <td className="py-2 px-4 border-b">{order.status}</td>

                  {/* Order Date Column */}
                  <td className="py-2 px-4 border-b">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default OrderTable;
