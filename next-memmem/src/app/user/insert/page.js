import "../../../css/table.css";
import "../../../css/input.css";

const InsertPage = () => {
  return (
    <>
      <h1 class="list_title">회원 등록</h1>
      <div class="wrap">
        <div class="input_div">
          <form class="formBox input_box">
            <h3>회원 정보</h3>
            <div class="user_error"></div>
            <label>ID</label>
            <input class="us_uid" placeholder="리스트에서 선택해주세요" name="us_uid" readonly />
            <label>이름</label>
            <input
              class="us_uname"
              placeholder="리스트에서 선택해주세요"
              name="us_uname"
              readonly
            />
            <input class="us_utel" type="hidden" placeholder="전화번호" name="us_utel" />
            <input type="hidden" class="us_cname" placeholder="업체명" name="us_cname" readonly />
            <input
              type="hidden"
              class="us_ccode"
              placeholder="업체코드"
              name="us_ccode"
              value="${CCODE}"
              readonly
            />

            <h3>수강권 정보</h3>
            <div class="m_error"></div>

            <div class="selectBox">
              <select class="select" name="r_iseq">
                <option value="0">--수강권선택--</option>
                <option></option>
              </select>
            </div>
            <label>수강권횟수</label>
            <input
              class="r_icount"
              placeholder="수강권횟수"
              name="r_icount"
              value="${U.r_icount }"
              readonly
            />
            <label>시작일</label>
            <input class="r_sdate" type="date" name="r_sdate" value="${U.r_sdate }" />
            <label>종료일</label>
            <input class="r_edate" type="date" name="r_edate" value="${U.r_edate }" />

            <input type="button" value="저장" class="insert" />
          </form>
        </div>

        <div class="member_list">
          <h3>USER 리스트</h3>

          <div class="table_wrapper">
            <table class="list tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                <tr data-id="${USER.u_id }">
                  <td>1</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default InsertPage;
