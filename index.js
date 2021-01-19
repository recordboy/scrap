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

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, 'client/build')));

// 라우트 설정
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// 크롤링 태그 정보
const crawlingTag = {
  google: {
    search: "input[class='gLFyf gsfi']",
    contents: "#rso div.g",
  },
  naver: {
    search: "#query",
    contents:
      "#main_pack > section.sc_new.sp_ntotal._prs_web_gen._web_gen._sp_ntotal ul.lst_total > li.bx",
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
    headless: false,
  });

  // 브라우저 열기
  const page = await browser.newPage();

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
  // browser.close();
  return result;
};

/**
 * @param {Promise} page 브라우저
 * @param {String} portal 포탈
 * @param {Object} crawlingTag 검색 옵션
 * @return {Array} 검색 데이터
 */
const selectKeyword = async (page, portal, crawlingTag) => {
  let portalInfo = {};

  portalInfo.portal = portal;
  if (portal === "google") {
    portalInfo.tag = crawlingTag.google.contents;
  } else if (portal === "naver") {
    portalInfo.tag = crawlingTag.naver.contents;
  }

  try {
    // 해당 콘텐츠가 로드될 때까지 대기
    await page.waitForSelector(portalInfo.tag, { timeout: 1000 });
  } catch (error) {
    console.log("오류 발생: " + error);
    return [
      {
        title: "검색 결과 없음",
        link: "",
        text: "",
      },
    ];
  }

  // 여기서부터는 퍼펫티어(크로뮴) 영역
  const result = await page.evaluate((portalInfo) => {
    console.log(111);

    const contents = Array.from(document.querySelectorAll(portalInfo.tag));
    let contentsList = [];

    // 검색 결과 스크래핑
    contents.forEach((item) => {
      // google
      if (portalInfo.portal === "google") {
        contentsList.push({
          title: item.querySelectorAll("h3")[0].innerText, // 타이틀
          link: item.getElementsByClassName("yuRUbf")[0].children[0].href, // 링크
          text: item.getElementsByClassName("aCOpRe")[0].textContent, // 내용
        });

        // naver
      } else if (portalInfo.portal === "naver") {
        contentsList.push({
          title: item.querySelectorAll("div.total_tit > a")[0].textContent, // 타이틀
          link: item.querySelectorAll("a")[0].href, // 링크
          text: item.querySelectorAll("div.total_group > div > a > div")[0]
            .textContent, // 내용
        });
      }
    });

    console.log(contents);
    console.log(contentsList);

    return contentsList;
  }, portalInfo);

  return result;
};
