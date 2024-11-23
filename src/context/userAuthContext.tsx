import { createContext, ReactNode, useState } from "react";

const initialUserContext = {
  user: null,
  setUser: () => {},
};
export const UserAuthContext = createContext<UserContext>(initialUserContext);

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};
type UserContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type UserAuthProviderProps = {
  children: ReactNode;
};

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}
