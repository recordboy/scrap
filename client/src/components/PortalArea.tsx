import React from "react";
import SearchList from "./SearchList";
import "./PortalArea.scss";

const PortalArea = (props: {
  portalName: string;
  searchData: any;
}) => {
  const { portalName, searchData } = props;

  return (
    <div className="portal-area">
      <h2>{portalName}</h2>
      <SearchList searchData={searchData} />
    </div>
  );
};

export default PortalArea;
