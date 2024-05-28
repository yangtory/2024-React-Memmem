// TicketContext.js
import { createContext, useContext, useState } from "react";

const AddListContext = createContext();

export const useAdd = () => {
  return useContext(AddListContext);
};

export const AddListProvider = ({ children }) => {
  const [ticketList, setTicketList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [noticeList, setNoticeList] = useState([]);
  const [userTicketList, setUserTicketList] = useState([]);

  const addTicket = (newTicket) => {
    setTicketList((prevList) => [...prevList, newTicket]);
  };
  const addTeacher = (newTeacher) => {
    setTeacherList((prevList) => [...prevList, newTeacher]);
  };

  const addNotice = (newNotice) => {
    setNoticeList((prevList) => [...prevList, newNotice]);
  };

  const addUserTicket = (newUserTicket) => {
    setUserTicketList((prevList) => [...prevList, newUserTicket]);
  };

  return (
    <AddListContext.Provider
      value={{
        ticketList,
        setTicketList,
        teacherList,
        setTeacherList,
        noticeList,
        setNoticeList,
        addTicket,
        addTeacher,
        addNotice,
        addUserTicket,
      }}
    >
      {children}
    </AddListContext.Provider>
  );
};
