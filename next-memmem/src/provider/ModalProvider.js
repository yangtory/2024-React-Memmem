import { createContext, useContext, useState } from 'react';

// Create Context for Modal
const ModalContext = createContext();

// Custom hook to use the Modal context
export const useModal = () => useContext(ModalContext);

// ModalProvider component to wrap around the parts of the app where you need modal control
export const ModalProvider = ({ children }) => {
    const [isModal, setIsModal] = useState(false);

    return <ModalContext.Provider value={{ isModal, setIsModal }}>{children}</ModalContext.Provider>;
};
