import React from "react";
import "./SearchItem.scss";

const SearchItem = (props: { item: any }) => {
  const { item } = props;

  return (
    <div className="card">
      <div className="kategorie">{item.kategorie}</div>
      <div className="title">
        {item.title}
        {item.link !== "" && <a className="link" href={item.link} target="_blank" rel="noreferrer"><i className="fa fa-link"></i></a>}
      </div>
      <div className="text">{item.text}</div>
    </div>
  );
};

export default SearchItem;
