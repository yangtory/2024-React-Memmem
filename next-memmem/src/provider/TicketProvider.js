// TicketContext.js
import { createContext, useContext, useState } from 'react';

const TicketContext = createContext();

export const useTicket = () => {
    return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
    const [ticketList, setTicketList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);

    const addTicket = (newTicket) => {
        setTicketList((prevList) => [...prevList, newTicket]);
    };
    const addTeacher = (newTeacher) => {
        setTeacherList((prevList) => [...prevList, newTeacher]);
    };

    return (
        <TicketContext.Provider
            value={{ ticketList, setTicketList, teacherList, setTeacherList, addTicket, addTeacher }}
        >
            {children}
        </TicketContext.Provider>
    );
};
