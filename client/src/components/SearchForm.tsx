import React, { useState } from "react";
import "./SearchForm.scss";

const SearchForm = (props: {
  getSearchData: (data: string) => void;
  isOnLoading: boolean;
}) => {
  const { getSearchData, isOnLoading } = props;
  const [searchText, setSearchText] = useState("");

  return (
    <div className="form-search">
      <input
        type="text"
        disabled={isOnLoading ? true : false}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onKeyPress={(e: any) => {
          if (e.charCode === 13) {
            if (!searchText) {
              alert("검색어를 입력해주세요");
              return;
            }
            getSearchData(e.target.value);
          }
        }}
      />
      <button
        type="button"
        disabled={isOnLoading ? true : false}
        onClick={() => {
          if (!searchText) {
            alert("검색어를 입력해주세요");
            return;
          }
          getSearchData(searchText);
        }}
      >
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
};

export default SearchForm;