import React from 'react';
import useAuth from '~/context/auth/useAuth';
import { Navigate } from 'react-router-dom';
import { FaPencilAlt, FaSave } from 'react-icons/fa';

export default function AuthRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // return <Navigate to="/signin" replace />;
        return <FaPencilAlt />;
    }

    return (
        // <div className="pt-[5.2vh] w-full flex justify-end">
        <div>
            {children}
        </div>
    );
}
