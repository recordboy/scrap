/**
 * google
 */
async function crawlerGoogle() {

  // 구글 이미지 검색
  await page.click("#hdtb-msb-vis > div:nth-child(3) > a");

  // 로딩 대기
  await page.waitForSelector("#islrg > div.islrc > div", { timeout: 5000 });

  const imgUrlList = await page.evaluate(() => {
    const contents = Array.from(
      document.querySelectorAll("#islrg > div.islrc > div")
    );
    let contentsList = [];
    contents.forEach((item) => {
      contentsList.push(item.querySelector("img").src);
      console.log(item.querySelector("img").src);
    });
    return contentsList;
  });
  // 이미지 경로 리스트 생성
  result.imgUrl = imgUrlList;

  console.log(imgUrlList);
}

module.exports = crawlerGoogle;
