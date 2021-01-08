import React from "react";
import "./SearchItem.scss";

const SearchItem = (props: { item: any }) => {
  const { item } = props;

  return (
    <div className="card">{item}</div>
  );
};

export default SearchItem;
