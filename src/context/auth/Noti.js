import React, { createContext, useState, useContext } from 'react';
import AxiosInterceptor from '~/components/api/AxiosInterceptor';
import { requestForToken, clearDeviceToken, getCurrentToken } from '~/ultis/firebase';

const NotiContext = createContext();

export function NotiProvider({ children }) {
  const [deviceToken, setDeviceToken] = useState(null);

  const requestAndUpdateToken = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        setDeviceToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error("Error requesting token:", error);
      return null;
    }
  };

  const deleteDeviceToken = async () => {
    try {
      const tokenToDelete = getCurrentToken() || deviceToken;
      if (tokenToDelete) {
        await AxiosInterceptor.delete("/api/device-tokens", {
          data: {
            token: tokenToDelete
          }
        });
        clearDeviceToken();
        setDeviceToken(null);
        console.log("deleted device token", tokenToDelete);
        
      }
    } catch (error) {
      console.error("Error deleting device token:", error);
    }
  };

  return (
    <NotiContext.Provider value={{ 
      deviceToken, 
      setDeviceToken, 
      deleteDeviceToken,
      requestAndUpdateToken 
    }}>
      {children}
    </NotiContext.Provider>
  );
}

export function useDeviceToken() {
  return useContext(NotiContext);
}