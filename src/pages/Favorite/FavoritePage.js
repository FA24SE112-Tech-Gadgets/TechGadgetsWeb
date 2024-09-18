import React, { useState, useRef, useEffect } from 'react';
import { MoreVert } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const initialShops = [
  {
    name: "Mobile Shop",
    products: [
      { id: 1, name: "iPhone 16 Pro Max", image: "https://s.net.vn/0hT0", description: "The latest iPhone with advanced features" },
      { id: 2, name: "iPhone 15 Pro", image: "https://s.net.vn/gsjW", description: "Powerful iPhone with pro camera system" },
      { id: 3, name: "Samsung Galaxy S22", image: "https://s.net.vn/ry0D", description: "Android flagship with excellent camera" },
      { id: 4, name: "Google Pixel 7", image: "https://s.net.vn/Nb72", description: "Pure Android experience with great AI" },
      { id: 5, name: "OnePlus 10 Pro", image: "https://s.net.vn/FBc4", description: "Fast charging and smooth performance" },
      { id: 6, name: "Xiaomi Mi 12", image: "https://s.net.vn/uwCW", description: "High-end specs at a competitive price" },
    ]
  },
  {
    name: "Hadao Shop",
    products: [
      { id: 7, name: "Xiaomi ROG", image: "/placeholder.svg", description: "Gaming smartphone with high performance" },
      { id: 8, name: "Laptop ASUS", image: "/placeholder.svg", description: "Powerful laptop for work and gaming" },
      { id: 9, name: "Mechanical Keyboard", image: "/placeholder.svg", description: "Tactile typing experience for enthusiasts" },
      { id: 10, name: "Gaming Mouse", image: "/placeholder.svg", description: "High-precision mouse for competitive gaming" },
    ]
  },
  {
    name: "Babao",
    products: [
      { id: 11, name: "Máy hút bụi", image: "/placeholder.svg", description: "Efficient vacuum cleaner for your home" },
      { id: 12, name: "EarWireless", image: "/placeholder.svg", description: "High-quality wireless earbuds" },
      { id: 13, name: "Smart Home Hub", image: "/placeholder.svg", description: "Central control for your smart home devices" },
      { id: 14, name: "Robot Mop", image: "/placeholder.svg", description: "Automated floor cleaning solution" },
      { id: 15, name: "Air Purifier", image: "/placeholder.svg", description: "Clean air for a healthier home environment" },
    ]
  }
];

function FavoritePage() {
    const [favorites, setFavorites] = useState(initialShops);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentIndices, setCurrentIndices] = useState(favorites.map(() => 0));
    const prevRefs = useRef([]);
    const nextRefs = useRef([]);
    const swiperRefs = useRef([]);

    useEffect(() => {
        prevRefs.current = prevRefs.current.slice(0, favorites.length);
        nextRefs.current = nextRefs.current.slice(0, favorites.length);
        swiperRefs.current = swiperRefs.current.slice(0, favorites.length);
    }, [favorites]);

    const removeProduct = (shopIndex, productId) => {
        setFavorites(prevFavorites => {
            const newFavorites = [...prevFavorites];
            newFavorites[shopIndex] = {
                ...newFavorites[shopIndex],
                products: newFavorites[shopIndex].products.filter(product => product.id !== productId),
            };
            return newFavorites.filter(shop => shop.products.length > 0);
        });
        handleClose();
    };

    const handleClick = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    const nextSlide = (shopIndex) => {
        setCurrentIndices(prevIndices => {
            const newIndices = [...prevIndices];
            const maxIndex = Math.max(0, favorites[shopIndex].products.length - 3);
            newIndices[shopIndex] = Math.min(newIndices[shopIndex] + 1, maxIndex);
            return newIndices;
        });
        swiperRefs.current[shopIndex].slideNext();
    };

    const prevSlide = (shopIndex) => {
        setCurrentIndices(prevIndices => {
            const newIndices = [...prevIndices];
            newIndices[shopIndex] = Math.max(0, newIndices[shopIndex] - 1);
            return newIndices;
        });
        swiperRefs.current[shopIndex].slidePrev();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-extrabold text-center text-indigo-900 dark:text-white">Your Favorites</h1>
                </div>
                {favorites.map((shop, shopIndex) => (
                    <div key={shop.name} className="mb-16">
                        <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                            <div className="py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-gray-700">
                                <h2 className="text-2xl font-bold text-white">{shop.name}</h2>
                            </div>
                            <div className="p-6 relative" key={shopIndex}>
                                <Swiper
                                    spaceBetween={30}
                                    slidesPerView={3}
                                    navigation={{
                                        nextEl: nextRefs.current[shopIndex],
                                        prevEl: prevRefs.current[shopIndex],
                                    }}
                                    modules={[Navigation]}
                                    onInit={(swiper) => {
                                        swiperRefs.current[shopIndex] = swiper;
                                        swiper.params.navigation.prevEl = prevRefs.current[shopIndex];
                                        swiper.params.navigation.nextEl = nextRefs.current[shopIndex];
                                        swiper.navigation.init();
                                        swiper.navigation.update();
                                    }}
                                    className="custom-swiper"
                                >
                                    {shop.products.map(product => (
                                        <SwiperSlide key={product.id}>
                                            <div className="rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-50 dark:bg-gray-700">
                                                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-lg font-semibold text-indigo-900 dark:text-white">{product.name}</h3>
                                                        <IconButton onClick={(e) => handleClick(e, product)} size="small">
                                                            <MoreVert />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl) && selectedProduct?.id === product.id}
                                                            onClose={handleClose}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'right',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right',
                                                            }}
                                                        >
                                                            <MenuItem onClick={() => removeProduct(shopIndex, product.id)}>Remove</MenuItem>
                                                        </Menu>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {currentIndices[shopIndex] > 0 && (
                                    <div
                                        ref={el => prevRefs.current[shopIndex] = el}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 dark:bg-gray-100 dark:text-black rounded-full cursor-pointer shadow-md"
                                        onClick={() => prevSlide(shopIndex)}
                                    >
                                        <GrFormPrevious size={24} />
                                    </div>
                                )}
                                {currentIndices[shopIndex] < favorites[shopIndex].products.length - 3 && (
                                    <div
                                        ref={el => nextRefs.current[shopIndex] = el}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 dark:bg-gray-100 dark:text-black rounded-full cursor-pointer shadow-md"
                                        onClick={() => nextSlide(shopIndex)}
                                    >
                                        <MdNavigateNext size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        </div>
    );
}

export default FavoritePage;