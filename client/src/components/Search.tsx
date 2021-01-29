import React from "react";
import SearchForm from "./SearchForm";
import SelectForm from "./SelectForm";
import "./Search.scss";

const Search = (props: {
  portalList: any;
  setIsOnPortal: (id: string, isOn: boolean) => void;
  getSearchData: (data: string) => void;
  isOnLoading: boolean;
}) => {
  const { getSearchData, portalList, setIsOnPortal, isOnLoading } = props;
  return (
    <div className="search">
      <SelectForm portalList={portalList} setIsOnPortal={setIsOnPortal} />
      <SearchForm getSearchData={getSearchData} isOnLoading={isOnLoading} />
    </div>
  );
};

export default Search;