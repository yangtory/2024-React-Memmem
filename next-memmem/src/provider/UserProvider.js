// TicketContext.js
import { getSession, useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { findUnique } from "../app/api/user";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  console.log("USER Providoer", session);

  // user의 ccode 셋팅
  const getCCode = async () => {
    // const session = await getSession();
    const u_id = session?.user?.id;
    // const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
    console.log(ccode);
    return ccode;
  };

  return (
    <UserContext.Provider value={{ getCCode }}>
      {children}
    </UserContext.Provider>
  );
};
