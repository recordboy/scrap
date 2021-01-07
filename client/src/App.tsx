import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import SelectForm from "./components/SelectForm";
import PortalArea from "./components/PortalArea";
import "./App.css";

function App() {
  const [searchData, setSearchData] = useState([]);

  const [isChangePortal, setIsChangePortal] = useState(true);
  const [portalList, setPortalList] = useState<any>([
    { Google: false },
    { NAVER: false },
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

    // 포탈 목록 변경 감지
    if (isChangePortal) {
      setIsChangePortal(false);
    } else {
      setIsChangePortal(true);
    }
  };

  /**
   * 서버에 검색 키워드 요청
   * @param {String} data 검색 키워드
   */
  const getSearchData = (data: string) => {
    console.log("검색 문구: ", data);
    fetch(`/api/data?searchText=${data}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSearchData(data);
        console.log("검색 결과: ", data);
      });
  };

  return (
    <div className="App" style={{ height: window.innerHeight }}>
      <SearchForm getSearchData={getSearchData} />
      <SelectForm setIsOnPortal={setIsOnPortal} />
      
      {/* 추가 수정 필요 */}
      {portalList.map((item: any, idx: number): JSX.Element | undefined => {
        const portalName: string = String(Object.keys(item));
        if (item[portalName]) {
          return <PortalArea key={idx} portalName={portalName} searchData={searchData} />;
        }
      })}
    </div>
  );
}

export default App;
