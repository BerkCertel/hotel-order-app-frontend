import HotelAuthModal from "@/components/modals/HotelAuthModal";
import { setOrderUser } from "@/store/orderuserSlice";
import { RootState, useAppDispatch } from "@/store/store";
import React, { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

type HotelAuthContextType = {
  isAuthenticated: boolean;
};

const HotelAuthContext = createContext<HotelAuthContextType>({
  isAuthenticated: false,
});

export const useHotelAuth = () => useContext(HotelAuthContext);

export const HotelAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { orderUser } = useSelector((state: RootState) => state.orderuser);
  const dispatch = useAppDispatch();

  return (
    <HotelAuthContext.Provider value={{ isAuthenticated }}>
      <HotelAuthModal
        open={!isAuthenticated || !orderUser || !orderUser.roomNumber}
        // open={isAuthenticated}
        onSuccess={(roomNumber, name) => {
          dispatch(setOrderUser({ roomNumber, name })); // isim de redux’a kaydolur
          setAuthenticated(true);
        }}
      />
      {children}
    </HotelAuthContext.Provider>
  );
};
