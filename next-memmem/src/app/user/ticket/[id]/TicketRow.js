import React from "react";

const TicketRow = ({ list, setTicketSeq }) => {
  const calcDday = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - today.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 3600 * 24)
    );
    return differenceInDays;
  };

  const dDay = calcDday(list.r_edate);

  return (
    <tr onClick={() => setTicketSeq(list.r_iseq)}>
      <td>{list.r_uid}</td>
      <td>{list.tbl_minfo.i_title}</td>
      <td>{list.r_icount}</td>
      <td>{list.r_sdate}</td>
      <td>{list.r_edate}</td>
      <td>
        <span className="dday">
          {dDay >= 0 ? "-" + dDay : "기간만료"}
        </span>
      </td>
    </tr>
  );
};

export default TicketRow;
