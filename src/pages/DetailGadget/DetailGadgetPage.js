import React, { useState } from 'react';
import { Star, ChevronUp, ChevronDown, Truck, ShieldCheck } from 'lucide-react'


const productData = {
    "items": [
        {
            "id": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
            "name": "Điện thoại Masstel IZI T6 4G",
            "price": 500000,
            "thumbnailUrl": "https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-thumb-600x600.jpg",
            "url": "https://www.thegioididong.com/dtdd/masstel-izi-t6",
            "shopId": "1f3c2205-1e9c-4efa-9c6b-57819c114793",
            "status": "Active",
            "createdAt": "2024-10-05T17:45:11.334466Z",
            "updatedAt": "2024-10-06T04:44:10.780197Z",
            "seller": null,
            "brand": null,
            "shop": {
                "id": "1f3c2205-1e9c-4efa-9c6b-57819c114793",
                "name": "Thế Giới Di Động",
                "websiteUrl": "https://www.thegioididong.com",
                "logoUrl": "https://storage.googleapis.com/fbdemo-f9d5f.appspot.com/Shops/Thegioididong.jpg"
            },
            "category": {
                "id": "ea4183e8-5a94-401c-865d-e000b5d2b72d",
                "name": "Điện thoại"
            },
            "gadgetDescriptions": [
                {
                    "id": "647c790d-8424-4770-b151-70e064e4e2d5",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Viên pin 1800 mAh, sử dụng bền bỉ nhiều ngày",
                    "type": "BoldText",
                    "index": 7
                },
                {
                    "id": "0f900af4-a73f-4810-9453-c8f22fa8c01f",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Tiện ích đa dạng, phục vụ mọi nhu cầu",
                    "type": "BoldText",
                    "index": 9
                },
                {
                    "id": "09b84cbb-b28f-4a96-9c83-fcf35884ba5c",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Điện thoại hỗ trợ hai nano SIM, kết nối 4G VoLTE - công nghệ giúp nâng cao chất lượng cuộc gọi. Bên cạnh đó, khả năng lưu trữ lên đến 2000 số điện thoại giúp bạn quản lý danh bạ một cách dễ dàng, không lo lắng về việc hết không gian.",
                    "type": "NormalText",
                    "index": 6
                },
                {
                    "id": "091f86b9-4044-44ff-86e8-642036f5ebd5",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Trong thời đại smartphone ngày càng trở nên phổ biến, Masstel IZI T6 4G như làn gió mới cho những ai mong muốn trở về với sự đơn giản, tiện ích trong sử dụng hằng ngày. Điện thoại là sự lựa chọn lý tưởng cho nhóm khách hàng có nhu cầu cơ bản như nghe gọi và nhắn tin, đặc biệt phù hợp với người lớn tuổi.",
                    "type": "BoldText",
                    "index": 0
                },
                {
                    "id": "5c1b0152-b548-48b7-a959-1d514d5d1148",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Pin 1800 mAh của Masstel IZI T6 4G đảm bảo bạn có thể sử dụng điện thoại liên tục suốt nhiều ngày mà không cần sạc, cùng cổng sạc Type-C hỗ trợ công suất 2.5 W giúp việc sạc pin trở nên nhanh chóng và thuận tiện.",
                    "type": "NormalText",
                    "index": 8
                },
                {
                    "id": "73b417ae-6a2a-4b5a-b691-b19ffb2ec1a5",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Màn hình hiển thị chất lượng",
                    "type": "BoldText",
                    "index": 3
                },
                {
                    "id": "84acaec1-df9e-4565-87bd-ef97c11ec78f",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Masstel IZI T6 4G là một thiết bị điện thoại phổ thông đơn giản nhưng không kém phần mạnh mẽ và tiện ích. Dành cho mọi người từ học sinh đến người lớn tuổi, đây chắc chắn là sự lựa chọn hoàn hảo để giữ bạn luôn kết nối với mọi người xung quanh.",
                    "type": "NormalText",
                    "index": 11
                },
                {
                    "id": "9ff739bd-5767-4d4d-b48c-0f1220d24c52",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Thiết kế nhỏ gọn và dễ sử dụng",
                    "type": "BoldText",
                    "index": 1
                },
                {
                    "id": "a24214e7-f5fc-4d21-8afc-5575fe8abd66",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Bên cạnh các chức năng cơ bản như nghe gọi và nhắn tin, Masstel IZI T6 4G còn tích hợp radio FM có thể sử dụng mà không cần tai nghe, chức năng nghe nhạc MP3 và công tắc bật/tắt đèn pin tiện lợi được đặt bên hông máy, mang đến cho bạn những trải nghiệm thú vị và tiện ích trong cuộc sống hằng ngày.",
                    "type": "NormalText",
                    "index": 10
                },
                {
                    "id": "a54cd701-794a-4cdc-be8e-1ce72802a337",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Với kích thước màn hình 2.4 inch cùng tấm nền TFT LCD, Masstel IZI T6 4G cung cấp cho bạn trải nghiệm hình ảnh tươi sáng và rõ ràng, đảm bảo bạn có thể dễ dàng đọc tin nhắn và số điện thoại mà không phải căng mắt.",
                    "type": "NormalText",
                    "index": 4
                },
                {
                    "id": "d3a56098-5948-4fa1-adb9-1458953dc9d7",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Chiếc điện thoại Masstel này được thiết kế nhỏ gọn, dễ cầm nắm, là bạn đồng hành lý tưởng cùng bạn mọi nơi, mọi lúc. Với bàn phím T9 dạng nổi, việc nhấn phím trở nên dễ dàng và thoải mái hơn bao giờ hết, đảm bảo cảm giác nhập số hoặc nhắn tin mượt mà, đặc biệt với người lớn tuổi. Không dừng lại ở đó, thiết kế pin rời mang lại khả năng thay thế dễ dàng khi pin đã đến lúc cần được thay mới.",
                    "type": "NormalText",
                    "index": 2
                },
                {
                    "id": "fa1fc5fc-b5d2-48d1-8b83-9350b545d695",
                    "gadgetId": "19bde5b7-1199-4ac3-9a3e-e08d2990ac90",
                    "value": "Kết nối 4G VoLTE với chất lượng cuộc gọi xuất sắc",
                    "type": "BoldText",
                    "index": 5
                }
            ],
            "specifications": [
                {
                    "id": "0e62c2e3-0caa-4cba-9c17-cef1b8bc7fc4",
                    "name": "Pin & Sạc",
                    "specificationKeys": [
                        {
                            "id": "1892d83d-e37e-4db3-9256-976c57a1d4f6",
                            "name": "Hỗ trợ sạc tối đa:",
                            "specificationValues": [
                                {
                                    "id": "478ba51f-c328-42ba-a975-41362b1fcb89",
                                    "value": "2.5 W"
                                }
                            ]
                        },
                        {
                            "id": "567d59c2-3e4d-4311-9f8a-fe92653273e3",
                            "name": "Loại pin:",
                            "specificationValues": [
                                {
                                    "id": "76600b76-44af-4c6e-a65d-93e3e3e09d51",
                                    "value": "Li-Ion"
                                }
                            ]
                        },
                        {
                            "id": "bf5ab506-ee83-4045-acf1-da373fada49a",
                            "name": "Dung lượng pin:",
                            "specificationValues": [
                                {
                                    "id": "55c99220-b3ad-4892-b08d-143d822086e7",
                                    "value": "1800 mAh"
                                }
                            ]
                        },
                        {
                            "id": "ebc912a9-5003-4a53-8582-fbd76013c62e",
                            "name": "Sạc kèm theo máy:",
                            "specificationValues": [
                                {
                                    "id": "ec6a1f49-ebdb-452c-8784-e5989ceb1051",
                                    "value": "2.5 W"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "3b8c64d5-eb4f-47d1-9cb5-8d9f61488a8a",
                    "name": "Thông tin chung",
                    "specificationKeys": [
                        {
                            "id": "49bdf15c-4cdf-4c03-bf4b-62163511ac88",
                            "name": "Kích thước, khối lượng:",
                            "specificationValues": [
                                {
                                    "id": "98884878-1cb3-40dd-a8f4-27a7c6d270b1",
                                    "value": "Dài 130.7 mm - Ngang 54.2 mm - Dày 15 mm - Nặng 112 g"
                                }
                            ]
                        },
                        {
                            "id": "52a155a9-42bf-4267-bccc-d9b5b97a1fb3",
                            "name": "Hãng:",
                            "specificationValues": [
                                {
                                    "id": "8773222b-75e1-48fe-8ad8-fd82cd0b63c0",
                                    "value": "Masstel. Xem thông tin hãng"
                                }
                            ]
                        },
                        {
                            "id": "a12aec5f-32e3-48a2-8ca7-1ebc8259997a",
                            "name": "Thời điểm ra mắt:",
                            "specificationValues": [
                                {
                                    "id": "4036cdb5-b74f-4fd4-8137-d54a574a3733",
                                    "value": "04/2024"
                                }
                            ]
                        },
                        {
                            "id": "c7299931-25d1-498b-99d6-58b52faf3b91",
                            "name": "Thiết kế:",
                            "specificationValues": [
                                {
                                    "id": "84279206-9030-429a-94fd-c68f76cc4a7f",
                                    "value": "Pin rời"
                                }
                            ]
                        },
                        {
                            "id": "ebf29189-8347-4a25-8632-fd09e16fe6da",
                            "name": "Chất liệu:",
                            "specificationValues": [
                                {
                                    "id": "559d89f0-1278-4a4c-804e-a09d1aafcd57",
                                    "value": "Khung & Mặt lưng nhựa"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "712ed1d6-b80c-49cb-8da5-e80cd571cc2f",
                    "name": "Tiện ích",
                    "specificationKeys": [
                        {
                            "id": "00b318a3-ce20-409b-a6b4-be1412eea5f5",
                            "name": "Xem phim:",
                            "specificationValues": [
                                {
                                    "id": "a21c66a7-cdf9-44ab-af6d-55e80de6c192",
                                    "value": "3GP"
                                },
                                {
                                    "id": "401323f7-3a1d-49f6-b33e-171b4e842c7e",
                                    "value": "AV1"
                                }
                            ]
                        },
                        {
                            "id": "1eeb63c8-42f0-4f9c-ab67-e773966e62c7",
                            "name": "Đèn pin:",
                            "specificationValues": [
                                {
                                    "id": "00437bf2-d4b0-49ec-9db8-2f59874773b0",
                                    "value": "Có"
                                }
                            ]
                        },
                        {
                            "id": "5047acef-d594-4ac8-bf77-a8a7b3883413",
                            "name": "Nghe nhạc:",
                            "specificationValues": [
                                {
                                    "id": "cec5a8ae-bbfe-4970-849b-b23c46bb63a3",
                                    "value": "WAV"
                                },
                                {
                                    "id": "9080ae02-c7d8-4226-923a-f04250ae69f6",
                                    "value": "AAC"
                                },
                                {
                                    "id": "a15c23d8-eea9-4585-8882-99e279ec5144",
                                    "value": "MP3"
                                }
                            ]
                        },
                        {
                            "id": "78010c48-6200-473b-8d71-13a68adc6884",
                            "name": "Ghi âm:",
                            "specificationValues": [
                                {
                                    "id": "d8f383c4-9fb2-4086-8b5c-0abd5c1c96f4",
                                    "value": "Ghi âm cuộc gọi"
                                },
                                {
                                    "id": "73e3123d-7b20-415c-bc63-2825b55a7391",
                                    "value": "Ghi âm mặc định"
                                }
                            ]
                        },
                        {
                            "id": "8d0dfb16-41ac-492d-a456-395b4b90bfb8",
                            "name": "Radio:",
                            "specificationValues": [
                                {
                                    "id": "d97e0b6b-541e-44ce-8a02-b947e88bfc51",
                                    "value": "FM không cần tai nghe"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "83153da3-8cd8-4458-b44c-9aa5b900fac9",
                    "name": "Màn hình",
                    "specificationKeys": [
                        {
                            "id": "3fca1b10-da96-45c6-9900-3bd5d22bb35b",
                            "name": "Công nghệ màn hình:",
                            "specificationValues": [
                                {
                                    "id": "a33e81cd-6350-4e41-8abf-21ab6f004b18",
                                    "value": "TFT LCD"
                                }
                            ]
                        },
                        {
                            "id": "521471c8-1dbf-4ac3-9de4-c1ef1811e198",
                            "name": "Độ phân giải:",
                            "specificationValues": [
                                {
                                    "id": "4e940394-3b5a-4194-8169-8fed694fc8dd",
                                    "value": "QVGA (240 x 320 Pixels)"
                                }
                            ]
                        },
                        {
                            "id": "b97f0fbc-befb-473b-af4d-558da87315b9",
                            "name": "Màn hình rộng:",
                            "specificationValues": [
                                {
                                    "id": "2562db5d-3ca0-4886-91b2-1c814e9f6dea",
                                    "value": "2.4\""
                                }
                            ]
                        },
                        {
                            "id": "c91e7623-16a7-4297-a62e-c570334e911e",
                            "name": "Mặt kính cảm ứng:",
                            "specificationValues": [
                                {
                                    "id": "e23cdac5-08da-4558-8f44-65311caa2c14",
                                    "value": "Không có cảm ứng"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "a2f887f7-6961-4744-9887-ee7c1ca2e580",
                    "name": "Kết nối",
                    "specificationKeys": [
                        {
                            "id": "28ba51f5-61ee-402b-b1a7-022798d972b3",
                            "name": "Jack tai nghe:",
                            "specificationValues": [
                                {
                                    "id": "87d9e67d-4b35-41be-9102-7ee2e10ef62a",
                                    "value": "3.5 mm"
                                }
                            ]
                        },
                        {
                            "id": "6d23ac03-d923-4a83-be29-ef2a03f41595",
                            "name": "SIM:",
                            "specificationValues": [
                                {
                                    "id": "de0aa06b-07b3-4714-8afc-328c52a13eb4",
                                    "value": "2 Nano SIM"
                                }
                            ]
                        },
                        {
                            "id": "a687958c-5128-4ee2-bcc8-30895f390476",
                            "name": "Bluetooth:",
                            "specificationValues": [
                                {
                                    "id": "ff7d7ff6-fef5-4b97-8b5a-added2610378",
                                    "value": "v2.1"
                                }
                            ]
                        },
                        {
                            "id": "c4790764-465e-464f-89d5-bd88f3917c5a",
                            "name": "Mạng di động:",
                            "specificationValues": [
                                {
                                    "id": "8fde7b1e-748b-4e7f-a5ad-3716dfdcab2a",
                                    "value": "Hỗ trợ 4G"
                                }
                            ]
                        },
                        {
                            "id": "fac7ec85-7161-4b06-9bc8-6597bf60878b",
                            "name": "Cổng kết nối/sạc:",
                            "specificationValues": [
                                {
                                    "id": "98bbc160-68f2-40e6-b4ca-84b370a720f0",
                                    "value": "Type-C"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "ae681e6c-54e7-4aaf-86b7-da44115243ed",
                    "name": "Bộ nhớ & Lưu trữ",
                    "specificationKeys": [
                        {
                            "id": "26c3a09d-b8c8-4546-94e9-3bffce1614a3",
                            "name": "RAM:",
                            "specificationValues": [
                                {
                                    "id": "76213c6c-0d9c-4b90-9932-6797a6a41040",
                                    "value": "48 MB"
                                }
                            ]
                        },
                        {
                            "id": "75235ede-ee98-42bd-be28-891ab4ae89a1",
                            "name": "Thẻ nhớ:",
                            "specificationValues": [
                                {
                                    "id": "11717b5d-2c11-49ad-95ae-ded5f32b8b79",
                                    "value": "MicroSD, hỗ trợ tối đa 32 GB"
                                }
                            ]
                        },
                        {
                            "id": "7f0361d1-223b-48b9-b756-fb4c41102346",
                            "name": "Danh bạ:",
                            "specificationValues": [
                                {
                                    "id": "5c24f99e-4980-4a3c-bc8c-3563903fbfca",
                                    "value": "2000 số"
                                }
                            ]
                        },
                        {
                            "id": "b5712a35-9f82-44bd-8f54-7be9d1b9f19e",
                            "name": "Dung lượng lưu trữ:",
                            "specificationValues": [
                                {
                                    "id": "31c9c980-79f0-4b82-b875-484a94e4812f",
                                    "value": "128 MB"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "f18c8061-74c4-41d3-8ba3-2a3441fbc250",
                    "name": "Hệ điều hành & CPU",
                    "specificationKeys": [
                        {
                            "id": "91bff29e-58b9-4ae6-a489-93bba0589836",
                            "name": "Chip xử lý (CPU):",
                            "specificationValues": [
                                {
                                    "id": "101560bf-5600-42db-be5b-be637db3dd15",
                                    "value": "Unisoc T107 8 nhân"
                                }
                            ]
                        },
                        {
                            "id": "d716de37-ef4f-451c-aa03-a9a5b51dfa32",
                            "name": "Tốc độ CPU:",
                            "specificationValues": [
                                {
                                    "id": "709eafb3-d132-482f-a309-91b50ab401f0",
                                    "value": "1.0 GHz"
                                }
                            ]
                        }
                    ]
                }
            ],
            "gadgetImages": [
                {
                    "id": "2c82f023-8082-4058-ae08-c509b89c9029",
                    "imageUrl": "https://cdn.tgdd.vn/Products/Images/42/322877/Slider/masstel-izi-t6-tong-quan-2048x1144.jpg"
                },
                {
                    "id": "2e7eb9b7-ceb8-4a60-b7ee-5dfc10d5e18d",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/Kit/masstel-izi-t6-mohop-org.jpg"
                },
                {
                    "id": "4374ca0e-3918-45e7-9dc3-682293ca4945",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-1-180x125.jpg"
                },
                {
                    "id": "57eef63e-91cf-4827-a983-a5052a7672e2",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-2-180x125.jpg"
                },
                {
                    "id": "684f3e63-97e5-4b6c-8f5c-52f232373808",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-8-180x125.jpg"
                },
                {
                    "id": "990ffbd4-811a-47be-a5d4-b6eff8b4176e",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-6-180x125.jpg"
                },
                {
                    "id": "eb1d6229-8c50-472b-928a-4170d2792f07",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-3-180x125.jpg"
                },
                {
                    "id": "f53ad0fc-5cca-4774-919d-0bde964f26f7",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-7-180x125.jpg"
                },
                {
                    "id": "05b0a155-b4df-437d-aba6-c50b41a403e6",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-4-180x125.jpg"
                },
                {
                    "id": "1083d628-6e87-4859-a5e3-b505eef57e65",
                    "imageUrl": "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_75,s_100x100/https://cdn.tgdd.vn/Products/Images/42/322877/masstel-izi-t6-green-5-180x125.jpg"
                }
            ]
        }
    ]
}

const DetailGadgetPage = () => {
    const [activeTab, setActiveTab] = useState('specifications')
    const [expandedSpecs, setExpandedSpecs] = useState({})
    const product = productData.items[0]

    const toggleSpecification = (id) => {
        setExpandedSpecs(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column */}
                <div className="lg:w-2/3">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

                    <div className="mb-6">
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>

                    <div className="flex space-x-2 mb-6 overflow-x-auto">
                        {product.gadgetImages.map((image, index) => (
                            <img
                                key={image.id}
                                src={image.imageUrl}
                                alt={`${product.name} - Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="rounded-md border border-gray-200"
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'specifications'
                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'text-gray-600 border-gray-300'
                                    }`}
                                onClick={() => setActiveTab('specifications')}
                            >
                                Thông số kỹ thuật
                            </button>
                            <button
                                className={`w-64 px-4 py-2 rounded-lg font-semibold text-base border border-blue-300 ${activeTab === 'review'
                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'text-gray-600 border-gray-300'
                                    }`}
                                onClick={() => setActiveTab('review')}
                            >
                                Bài viết đánh giá
                            </button>
                        </div>

                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                {product.specifications.map((spec) => (
                                    <div key={spec.id} className="border-b border-gray-200 p-4 bg-gray-100">
                                        <button
                                            className="flex justify-between items-center w-full text-left font-medium"
                                            onClick={() => toggleSpecification(spec.id)}
                                        >
                                            <span>{spec.name}</span>
                                            {expandedSpecs[spec.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </button>
                                        {expandedSpecs[spec.id] && (
                                            <div className="mt-2 space-y-2">
                                                {spec.specificationKeys.map((key) => (
                                                    <div key={key.id} className="flex border-b border-gray-200 p-2">
                                                        <span className="w-1/3 font-medium">{key.name}</span>
                                                        <span className="w-2/3">
                                                            {key.specificationValues.map((value) => value.value).join(', ')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'review' && (
                            <div className="space-y-4">
                                {product.gadgetDescriptions
                                    .sort((a, b) => a.index - b.index)
                                    .map((desc) => (
                                        <div key={desc.id} className={desc.type === 'BoldText' ? 'font-bold' : ''}>
                                            {desc.value}
                                        </div>
                                    ))}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailGadgetPage;
