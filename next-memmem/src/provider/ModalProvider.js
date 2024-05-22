import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isModal, setIsModal] = useState(false);
    const [teacherModal, setTeacherModal] = useState(false);

    return (
        <ModalContext.Provider value={{ isModal, setIsModal, teacherModal, setTeacherModal }}>
            {children}
        </ModalContext.Provider>
    );
};
