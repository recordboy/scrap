import React from "react";
import "./SearchItem.scss";

const SearchItem = (props: { item: any }) => {
  const { item } = props;

  return (
    <div className="card">
      <div className="title">
        {item.title}
        <a className="link" href={item.link} target="_blank" rel="noreferrer">바로가기
        </a>
      </div>
      <div className="text">{item.text}</div>
    </div>
  );
};

export default SearchItem;
