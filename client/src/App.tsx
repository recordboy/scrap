import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import SelectForm from "./components/SelectForm";
import PortalArea from "./components/PortalArea";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const [searchData, setSearchData] = useState<any>([
    // {
    //   name: "",
    //   data: [{ title: "", link: "", text: "" }],
    // },
  ]);
  const [portalList, setPortalList] = useState<any>([
    { google: true },
    { naver: false },
  ]);

  const [isOnLoading, setIsOnLoading] = useState(false);

  /**
   * 포털 노출 유무를 판단하는 체크박스 값 세팅
   * @param {String} id 포털 이름
   * @param {Boolean} isOn 포털 노출 유무
   */
  const setIsOnPortal = (id: string, isOn: boolean) => {
    const list: any = portalList;
    list.forEach((item: any) => {
      if (String(Object.keys(item)) === id) {
        item[id] = isOn;
      }
    });
    setPortalList(list);
  };

  /**
   * 서버에 각 포탈 검색 키워드 요청
   * @param {String} data 검색 키워드
   */
  const getSearchData = (data: string) => {
    // 각 포털 검색 데이터 리스트
    let dataList: any = [];

    // let isOnportalIdx: number = 0;
    // portalList.forEach((item: any, idx: number) => {
    //   const portalName: string = String(Object.keys(portalList[idx]));
    //   if (portalList[idx][portalName]) {
    //     isOnportalIdx ++;
    //   }
    // });

    // 검색 요청 카운트, 검색 요청은 체크된 포털 갯 수 만큼 요청함
    let count: number = 0;

    // 호출되는 횟수
    let callIdx: number = 0;

    // 포탈 리스트 갯수만큼 검색
    const interval = setInterval(() => {
      // 호출 카운트 시작
      count++;

      // 포탈 리스트보다 카운터가 많을 시 호출 취소
      if (count >= portalList.length) {
        count = 0;
        clearInterval(interval);
      }

      // 포탈 이름
      const portalName: string = String(Object.keys(portalList[count]));
      if (!portalList[count][portalName]) {
        return;
      }

      // 호출 횟수 증가
      callIdx++;
      
      console.log(portalName + "검색 문구: ", data);

      // 로딩 화면 노출
      setIsOnLoading(true);

      // 검색 요청
      fetch(`/api/data?portal=${portalName}&searchText=${data}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          dataList.push({ name: portalName, data: data });

          // 데이터 덩어리 갯 수와 호출 횟수가 같을 시 데이터 세팅
          if (dataList.length === callIdx) {
            // 데이터 세팅
            setSearchData(dataList);

            // 로딩바 제거
            setIsOnLoading(false);
          }

          console.log(portalName + " 검색 결과: ", data);
        });
    });
  };

  return (
    <div className="App" style={{ height: window.innerHeight }}>
      <Loading isOnLoading={isOnLoading} />
      <SearchForm getSearchData={getSearchData} />
      <SelectForm portalList={portalList} setIsOnPortal={setIsOnPortal} />
      {searchData.map((item: any, idx: number) => {
        return (
          <PortalArea key={idx} portalName={item.name} searchData={item} />
        );
      })}
    </div>
  );
}

export default App;
