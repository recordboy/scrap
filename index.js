// express 모듈 불러오기
const express = require("express");

// puppeteer 모듈 불러오기
const puppeteer = require("puppeteer");

// express 객체 생성
const app = express();

// path 모듈 불러오기
const path = require("path");

// 검색 요청 api
app.use("/api/data", async function (req, res) {
  console.log("검색 문구: ", req.query.searchText);
  res.json(await getSearchData(req.query.searchText));
});

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`server running at http ${port}`);

// // 리액트 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'client/build')));

// // 라우트 설정
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
// Crawling Start
//////////////////////////////////////////////////////////////////////////////////////////////////

const crawlingTag = {
  google: "#rso > div"
};

/**
 * @param {String} searchText 검색 문구
 * @return {Array} 검색 데이터
 */
const getSearchData = async (searchText) => {

  // 브라우저 실행, 옵션 headless모드
  const browser = await puppeteer.launch({
    headless: true,
  });

  // 브라우저 오픈
  const page = await browser.newPage();

  // 페이지 크기 설정
  // await page.setViewport({
  //   width: 1366,
  //   height: 768,
  // });

  

  await page.goto("https://www.google.com/"); // 구글 검색창 이동
  await page.type('input[class="gLFyf gsfi"]', searchText); // 검색 키워드
  await page.type('input[class="gLFyf gsfi"]', String.fromCharCode(13)); // 검색 시작

  const result = selectKeyword(page, crawlingTag);
  console.log(result);
  return result;
};

/**
 * @param {Promise} page 브라우저
 * @param {Object} crawlingTag 검색 옵션
 * @return {Array} 검색 데이터
 */
const selectKeyword = async (page, crawlingTag) => {

  console.log(typeof page);
  const itemTag = crawlingTag.google;

  // 해당 콘텐츠가 로드될 때까지 대기
  await page.waitForSelector(itemTag);
  const result = await page.evaluate((itemTag) => {
    const dataList = Array.from(document.querySelectorAll(itemTag));
    return dataList.map((data) => data.textContent);
  }, itemTag);

  return result;
};
