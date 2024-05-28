// TicketContext.js
import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export const useTicket = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const [ticketList, setTicketList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [noticeList, setNoticeList] = useState([]);

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
    set;
  };

  return (
    <TicketContext.Provider
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
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
