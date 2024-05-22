// TicketContext.js
import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export const useTicket = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const [ticketList, setTicketList] = useState([]);

  const addTicket = (newTicket) => {
    setTicketList((prevList) => [...prevList, newTicket]);
  };

  return (
    <TicketContext.Provider
      value={{ ticketList, setTicketList, addTicket }}
    >
      {children}
    </TicketContext.Provider>
  );
};
