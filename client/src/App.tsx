import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import SelectForm from "./components/SelectForm";
import PortalArea from "./components/PortalArea";
import "./App.css";

function App() {
  const [searchData, setSearchData] = useState([]);
  const [portalList, setPortalList] = useState<any>([
    { google: true },
    { naver: true },
  ]);

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
    // 검색 요청 카운트
    let count = 0;

    console.log(portalList);

    // 각 포털 검색 데이터 리스트
    let dataList: any = [];

    const interval = setInterval(() => {
      count++;
      if (count >= portalList.length) {
        count = 0;
        clearInterval(interval);
      }

      // 포탈 이름
      const portalName: string = String(Object.keys(portalList[count]));

      // 검색 요청
      console.log(portalName + "검색 문구: ", data);
      fetch(`/api/data?portal=${portalName}&searchText=${data}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          dataList.push({ name: portalName, data: data });

          if (dataList.length >= 2) {
            setSearchData(dataList);
          }

          console.log(portalName + " 검색 결과: ", data);
        });
    });
  };

  return (
    <div className="App" style={{ height: window.innerHeight }}>
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
