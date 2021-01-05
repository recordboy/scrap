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
  res.json(await search());
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

/**
 * @return {Array} 검색 결과 값
 */
const search = async () => {
  
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  const browser = await puppeteer.launch({
    headless: true,
  });

  // 새로운 페이지를 연다.
  const page = await browser.newPage();

  // 페이지의 크기를 설정한다.
  // await page.setViewport({
  //   width: 1366,
  //   height: 768,
  // });

  await page.goto("https://www.google.com/"); // 구글 검색창 이동
  await page.type('input[class="gLFyf gsfi"]', "퍼펫티어");
  await page.type('input[class="gLFyf gsfi"]', String.fromCharCode(13)); // 엔터키를 입력하여 검색 수행

  // await page.waitForSelector("h3", { timeout: 1000 });
  await page.waitForSelector("h3");

  const result = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("h3"));
    return anchors.map((anchor) => anchor.textContent);
  });

  return result;
}

// (async () => {
  
//   // 브라우저를 실행한다.
//   // 옵션으로 headless모드를 끌 수 있다.
//   const browser = await puppeteer.launch({
//     headless: true,
//   });

//   // 새로운 페이지를 연다.
//   const page = await browser.newPage();

//   // 페이지의 크기를 설정한다.
//   // await page.setViewport({
//   //   width: 1366,
//   //   height: 768,
//   // });

//   await page.goto("https://www.google.com/"); // 구글 검색창 이동
//   await page.type('input[class="gLFyf gsfi"]', "퍼펫티어");
//   await page.type('input[class="gLFyf gsfi"]', String.fromCharCode(13)); // 엔터키를 입력하여 검색 수행

//   // await page.waitForSelector("h3", { timeout: 1000 });
//   await page.waitForSelector("h3");

//   const result = await page.evaluate(() => {
//     const anchors = Array.from(document.querySelectorAll("h3"));
//     return anchors.map((anchor) => anchor.textContent);
//   });

//   console.log(result);
// })();
