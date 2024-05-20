const DashPage = () => {
  return (
    <section class="page">
      <div class="top">
        <div class="month">
          <div class="total">월 매출</div>

          <div class="error">
            <div class="total error_left">
              <div>아직 매출이 없습니다</div>
            </div>
          </div>
        </div>

        <div class="month">
          <div class="total">월 가입수</div>

          <div class="error">
            <div class="total error_right">
              <div>이용중인 회원이 없습니다</div>
            </div>
          </div>

          <div class="chart">
            <canvas id="myUserChart"></canvas>
            <div class="total_box">
              <div class="total">
                <span>이용중인 유저수</span>
                <p>여러명</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="total notice_list">공지사항</div>

        <div class="noList_wrapper">
          <div class="noList">등록된 공지사항이 없습니다.</div>
        </div>

        <div class="notice">
          <div class="table_wrapper">
            <table class="notice list">
              <thead>
                <tr>
                  <th class="index" width="20px">
                    No.
                  </th>
                  <th class="date" width="80px">
                    작성일자
                  </th>
                  <th class="title" width="200px">
                    제목
                  </th>
                  <th class="id" width="100px">
                    작성자
                  </th>
                </tr>
              </thead>
              <tbody>
                <h2>공지사항 리스트</h2>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashPage;
