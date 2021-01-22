import React from "react";
import SearchItem from "./SearchItem";
import "./SearchList.scss";

const SearchList = (props: { searchData: any }) => {
  const { searchData } = props;

  return (
    <div className="list">
      {searchData.data.mainCnt.map((item: any, idx: number) => {
        return <SearchItem key={idx} item={item} />;
      })}
      {/* <div className="inner img" style={{ width: searchData.data.imgUrl.length * 210 - 10 }}>
              {searchData.data.imgUrl.map((item: any, idx: number) => {
                return (
                  <div className="item">
                    <img src={item} alt="" />
                  </div>
                );
              })}
            </div> */}
    </div>
  );
};

export default SearchList;
