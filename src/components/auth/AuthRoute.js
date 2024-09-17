import React from 'react';
import useAuth from '~/context/auth/useAuth';
import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return (
        // <div className="pt-[5.2vh] w-full flex justify-end">
        <div>
            {children}
        </div>
    );
}
