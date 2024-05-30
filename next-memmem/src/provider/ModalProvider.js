// import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  // session 확인용
  // const { data: session } = useSession();
  // console.log("Modal Providoer", session);

  const [isModal, setIsModal] = useState(false);
  const [teacherModal, setTeacherModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isModal,
        setIsModal,
        teacherModal,
        setTeacherModal,
        noticeModal,
        setNoticeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
