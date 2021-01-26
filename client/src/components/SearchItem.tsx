import React from "react";
import "./SearchItem.scss";

const SearchItem = (props: { item: any }) => {
  const { item } = props;

  return (
    <div className="card">
      <div className="title">
        {item.title}
        <a className="link" href={item.link} target="_blank" rel="noreferrer"><i className="fa fa-external-link-alt"></i></a>
      </div>
      <div className="text">{item.text}</div>
      <div className="kategorie">{item.kategorie}</div>
    </div>
  );
};

export default SearchItem;
