import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { date } = context.params;
  // 날짜를 이용해 데이터를 가져옵니다.
  const res = await fetch(`http://localhost:3000/api/class/detail/${date}`);
  const data = await res.json();

  return {
    props: {
      date,
      data,
    },
  };
}

const ClassDetail = ({ date, data }) => {
  return (
    <div>
      <h1>Details for {date}</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h2>{item.c_name}</h2>
            <p>
              {item.c_sdate} - {item.c_edate}
            </p>
            <p>Teacher: {item.c_teacher}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassDetail;
