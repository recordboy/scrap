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
    nextBtn: "#pnnext"
  },
  naver: {
    search: "#query",
    contents: "#main_pack > section.sc_new",
    nextBtn: ".api_sc_page_wrap .btn_next"
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
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,2000",
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

  // 첫 검색 결과 가져오기
  result.mainCnt = await selectKeyword(page, portal, crawlingTag);

  // let btnLength = await page.evaluate(() => {
  //   const imgBtns = document.querySelectorAll(
  //     "#xjs > div > table > tbody > tr > td"
  //   );
  //   return imgBtns.length;
  // });

  try {
    // 더 보기 해당 버튼이 로드될 때까지 대기
    await page.waitForSelector(crawlingTag[portal].nextBtn, { timeout: 10000 });
  } catch (error) {
    console.log('더보기 버튼 없음: ' + error);
    return result;
  }

  // 다음 페이지가 있는지 체크
  const isOnNextPage = await page.evaluate((portal) => {
    let nextBtn = null;
    if (portal === "google") {
      nextBtn = document.querySelector("#pnnext");
    } else if (portal === "naver") {
      nextBtn = document.querySelector(".api_sc_page_wrap .btn_next");
    }
    if (nextBtn) {
      return true;
    }
  }, portal);

  // 최대 35번 다음페이지 출력
  if (isOnNextPage) {
    for (let i = 0; i < 35; i++) {
      console.log(portal + " " + i + " 페이지");
      await page.evaluate((portal) => {
        let nextBtn = null;
        if (portal === "google") {
          nextBtn = document.querySelector("#pnnext");
        } else if (portal === "naver") {
          nextBtn = document.querySelector(".api_sc_page_wrap .btn_next");
        }
        // 다음 버튼이 있는 경우에만 다음페이지 이동
        if (nextBtn) {
          nextBtn.click();
        }
      }, portal);

      // 검색 메인화면 콘텐츠 리스트 추가 생성
      result.mainCnt.push(...(await selectKeyword(page, portal, crawlingTag)));
    }
  }

  // 이미지 경로 리스트 생성
  // result.imgUrl = await googleImgSrc(page);

  // 브라우저 닫기
  browser.close();
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
    console.log("에러 발생: " + error);
    return [
      {
        title: "검색 결과 없음",
        link: "",
        text: "",
      },
    ];
  }

  // 예외 처리
  try {

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
            const title = item.querySelector("h3");
            const link = item.querySelector(".yuRUbf");
            const text = item.querySelector(".aCOpRe");
            const kategorie = item.querySelector(".iUh30 ");

            if (title && link && text && kategorie) {
              contentsList.push({
                title: title.textContent, // 타이틀
                link: link.children[0].href, // 링크
                text: text.textContent, // 내용
                kategorie: kategorie.textContent, // 카테고리
              });
            }
          }

          // naver
        } else if (portalInfo.portal === "naver") {
          let itemList = [];
          let classNameStr = item.className;
          let classNameArr = classNameStr.split(" ");
          let title = "";
          let link = "";
          let text = "";
          let kategorie = "";

          // 검색결과
          if (classNameArr.indexOf("sp_ntotal") > -1) {
            itemList = item.querySelectorAll(".bx");
            itemList.forEach((item) => {
              title = item.querySelector(".link_tit");
              link = item.querySelector(".link_tit");
              text = item.querySelector(".api_txt_lines");
              kategorie = "검색결과";
              console.log(itemList);
              addData();
            });

            // 지식백과
          } else if (classNameArr.indexOf("sp_nkindic") > -1) {
            itemList = item.querySelectorAll(".nkindic_basic");
            itemList.forEach((item) => {
              title = item.querySelector("h3");
              link = item.querySelector("a");
              text = item.querySelector(".api_txt_lines");
              kategorie = "지식백과";
              addData();
            });
            
            // view
          } else if (classNameArr.indexOf("sp_nreview") > -1) {
            itemList = item.querySelectorAll(".bx");
            itemList.forEach((item) => {
              title = item.querySelector(".api_txt_lines.total_tit");
              link = item.querySelector("a");
              text = item.querySelector(".total_dsc");
              kategorie = "view";
              addData();
            });

            // 뉴스
          } else if (classNameArr.indexOf("sp_nnews") > -1) {
            itemList = item.querySelectorAll(".bx");
            itemList.forEach((item) => {
              title = item.querySelector(".news_tit");
              link = item.querySelector(".news_tit");
              text = item.querySelector(".api_txt_lines.dsc_txt_wrap");
              kategorie = "뉴스";
              addData();
            });

            // 지식인
          } else if (classNameArr.indexOf("sp_nkin") > -1) {
            itemList = item.querySelectorAll(".bx");
            itemList.forEach((item) => {
              title = item.querySelector(".question_text");
              link = item.querySelector(".question_text");
              text = item.querySelector(".answer_area ");
              kategorie = "지식인";
              addData();
            });
          }

          function addData() {
            if (title && link && text && kategorie) {
              contentsList.push({
                title: title.textContent, // 타이틀
                link: link.href, // 링크
                text: text.textContent, // 내용
                kategorie: kategorie, // 카테고리
              });
              console.log(contentsList);
            }
          }
        }
      });

      console.log(contents); // 검색 콘텐츠
      console.log(contentsList); // 크롤링한 콘텐츠 자원

      return contentsList;
    }, portalInfo);

    return result;
  } catch (error) {
    // 에러 발생 시 에러 객체 반환
    console.log("검색 결과 에러 발생: " + error);
    return error;
  }
}
