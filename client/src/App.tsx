import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchList from "./components/SearchList";
import InputCheckbox from "./components/InputCheckbox";
import "./App.css";

function App() {
  const [searchData, setSearchData] = useState([]);

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
      <SearchList searchData={searchData} />
      <InputCheckbox />
      <InputCheckbox />
    </div>
  );
}

export default App;
