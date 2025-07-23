"use client";

import React, { createContext, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}; // Kullanıcı tipinizi burada tanımlayabilirsiniz

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUser: (userData: User) => void;
  clearUser: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
  clearUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
