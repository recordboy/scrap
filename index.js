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
  console.log("검색 포탈: ", req.query.portal);
  console.log("검색 문구: ", req.query.searchText);
  res.json(await getSearchData(req.query.portal, req.query.searchText));
});

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`${port} 포트에서 서버 대기중`);

// // 리액트 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'client/build')));

// // 라우트 설정
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

//////////////////////////////////////////////////////////////////////////////////////////////////
// Crawling Start
//////////////////////////////////////////////////////////////////////////////////////////////////

// 크롤링 태그 정보
const crawlingTag = {
  google: {
    search: "input[class='gLFyf gsfi']",
    list: "#rso div.g",
  },
  naver: {
    search: "#query",
    list: "a.api_txt_lines.total_tit",
  },
};

/**
 * @param {String} portal 검색 포탈
 * @param {String} searchText 검색 문구
 * @return {Array} 검색 데이터
 */
const getSearchData = async (portal, searchText) => {
  // 브라우저 실행, 옵션 headless모드
  const browser = await puppeteer.launch({
    headless: true,
  });

  // 브라우저 열기
  const page = await browser.newPage();

  // 브라우저 크기 설정
  // await page.setViewport({
  //   width: 1366,
  //   height: 768,
  // });

  // 포탈 검색

  if (portal === "google") {
    await page.goto("https://www.google.com/");
    await page.type(crawlingTag.google.search, searchText);
    await page.type(crawlingTag.google.search, String.fromCharCode(13));
  } else if (portal === "naver") {
    await page.goto("https://www.naver.com/");
    await page.type(crawlingTag.naver.search, searchText);
    await page.type(crawlingTag.naver.search, String.fromCharCode(13));
  }

  const result = await selectKeyword(page, portal, crawlingTag);
  console.log(result);

  // 브라우저 닫기
  browser.close();
  return result;
};

/**
 * @param {Promise} page 브라우저
 * @param {String} portal 포탈
 * @param {Object} crawlingTag 검색 옵션
 * @return {Array} 검색 데이터
 */
const selectKeyword = async (page, portal, crawlingTag) => {
  let itemTag = "";

  if (portal === "google") {
    itemTag = crawlingTag.google.list;
  } else if (portal === "naver") {
    itemTag = crawlingTag.naver.list;
  }

  // 해당 콘텐츠가 로드될 때까지 대기
  await page.waitForSelector(itemTag);
  const result = await page.evaluate((itemTag) => {
    const dataList = Array.from(document.querySelectorAll(itemTag));
    return dataList.map((data) => data.textContent);
  }, itemTag);

  return result;
};
