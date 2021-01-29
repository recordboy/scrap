import React from "react";
import SearchForm from "./SearchForm";
import SelectForm from "./SelectForm";
import "./Search.scss";

const Search = (props: {
  portalList: any;
  setIsOnPortal: (id: string, isOn: boolean) => void;
  getSearchData: (data: string) => void;
}) => {
  const { getSearchData, portalList, setIsOnPortal } = props;
  return (
    <div className="search">
      <div className="inner">
        <SelectForm portalList={portalList} setIsOnPortal={setIsOnPortal} />
        <SearchForm getSearchData={getSearchData} />
      </div>
    </div>
  );
};

export default Search;