// express 모듈 불러오기
const express = require("express");

// puppeteer 모듈 불러오기
const puppeteer = require("puppeteer");

// express 객체 생성
const app = express();

// path 모듈 불러오기
const path = require("path");

// 크롤러 모듈
const googleImgSrc = require("./crawler_modules/google/imgSrc");
const { callbackify } = require("util");
module.exports = googleImgSrc;

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`${port} 포트에서 서버 대기중`);

// 검색 요청 api
app.use("/api/data", async function (req, res) {
  console.log("검색 포탈: ", req.query.portal);
  console.log("검색 문구: ", req.query.searchText);
  res.json(await getSearchData(req.query.portal, req.query.searchText));
});

// 리액트 정적 파일 제공 (헤로쿠 빌드 전용)
app.use(express.static(path.join(__dirname, "client/build")));
// 라우트 설정 (헤로쿠 빌드 전용)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
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
async function getSearchData(portal, searchText) {
  // 브라우저 실행, 옵션 headless모드
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=900,2000",
    ],
  });

  // 검색 데이터
  let result = {
    mainCnt: [],
    imgUrl: [],
  };

  // 브라우저 열기
  const page = await browser.newPage();

  // 포탈로 이동
  await page.goto(`https://www.${portal}.com/`);

  //  검색어 입력
  await page.type(crawlingTag[portal].search, searchText);

  // 검색 시작
  await page.type(crawlingTag[portal].search, String.fromCharCode(13));

  // 검색 메인화면 콘텐츠 리스트 생성
  result.mainCnt = await selectKeyword(page, portal, crawlingTag);

  // let btnLength = await page.evaluate(() => {
  //   const imgBtns = document.querySelectorAll(
  //     "#xjs > div > table > tbody > tr > td"
  //   );
  //   return imgBtns.length;
  // });

  const isOnNextPage = await page.evaluate(() => {
    const nextBtn = document.querySelector("#pnnext");
    if (nextBtn) {
      return true;
    }
  });

  if (isOnNextPage) {
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => {
        const nextBtn = document.querySelector("#pnnext");
        if (nextBtn) {
          document.querySelector("#pnnext").click();
        }
      });

      // 검색 메인화면 콘텐츠 리스트 추가 생성
      result.mainCnt.push(...(await selectKeyword(page, portal, crawlingTag)));
    }
  }

  // 이미지 경로 리스트 생성
  // result.imgUrl = await googleImgSrc(page);

  // 브라우저 닫기
  // browser.close();
  return result;
}

/**
 * @param {Promise} page 브라우저
 * @param {String} portal 포탈
 * @param {Object} crawlingTag 검색 옵션
 * @return {Array} 검색 데이터
 */
async function selectKeyword(page, portal, crawlingTag) {
  let portalInfo = {}; // 검색 브라우저에 전달할 정보
  portalInfo.portal = portal; // 포탈 이름
  portalInfo.tag = crawlingTag[portal].contents; // 콘텐츠가 담겨있는 태그 이름

  // 예외 처리
  try {
    // 해당 콘텐츠가 로드될 때까지 대기
    await page.waitForSelector(portalInfo.tag, { timeout: 10000 });
  } catch (error) {
    // 해당 태그가 없을 시 검색 결과 없음 반환
    console.log("오류 발생: " + error);
    return [
      {
        title: "검색 결과 없음",
        link: "",
        text: "",
      },
    ];
  }

  // 퍼펫티어(크로뮴) 영역
  const result = await page.evaluate((portalInfo) => {
    // 검색된 돔 요소를 배열에 담음
    const contents = Array.from(document.querySelectorAll(portalInfo.tag));
    let contentsList = [];

    // 검색 결과 스크래핑
    contents.forEach((item) => {
      // google
      if (portalInfo.portal === "google") {
        if (item.className === "g") {
          contentsList.push({
            title: item.querySelectorAll("h3")[0].textContent, // 타이틀
            link: item.getElementsByClassName("yuRUbf")[0].children[0].href, // 링크
            text: item.getElementsByClassName("aCOpRe")[0].textContent, // 내용
          });
        }

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

    console.log(contents); // 검색 콘텐츠
    console.log(contentsList); // 크롤링한 콘텐츠 자원

    return contentsList;
  }, portalInfo);

  return result;
}
