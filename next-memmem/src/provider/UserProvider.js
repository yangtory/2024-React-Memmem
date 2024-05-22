// TicketContext.js
import { getSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import { findUnique } from "../app/api/user";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [id, setId] = useState("");

  // user의 ccode 셋팅
  const getCCode = async () => {
    const session = await getSession();
    const u_id = session?.user?.id;
    const ccode = (await findUnique({ u_id })).tbl_company[0].c_code;
    console.log(ccode);
    return ccode;
  };

  // user 의 id 셋팅
  const getId = async () => {
    const session = await getSession();
    const id = session?.user?.id;
    setId(id);
  };

  return (
    <UserContext.Provider value={{ id, setId, getCCode, getId }}>
      {children}
    </UserContext.Provider>
  );
};
