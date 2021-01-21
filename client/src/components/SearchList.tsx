import React from "react";
import SearchItem from "./SearchItem";
import "./SearchList.scss";

const SearchList = (props: { searchData: any }) => {
  const { searchData } = props;

  return (
    <div className="list">
      <div className="inner" style={{ width: searchData.data.mainCnt.length * 210 - 10 }}>
        {searchData.data.mainCnt.map((item: any, idx: number) => {
          return <SearchItem key={idx} item={item} />;
        })}
      </div>
    </div>
  );
};

export default SearchList;
