import React, { useState } from "react";
import PortalArea from "./PortalArea";
import "./DataTab.scss";

const DataTab = (props: { searchData: any }) => {
  const { searchData } = props;
  const [isOnTabIndex, setIsOnTabIndex] = useState(0);
  const tabChange = (index: number) => {
    setIsOnTabIndex(index);
  };

  return (
    <div className="tab">
      <div className="btn">
        <button
          type="button"
          className={isOnTabIndex === 0 ? "on" : undefined}
          onClick={() => {
            tabChange(0);
          }}
        >
          total
        </button>
        <button
          type="button"
          className={isOnTabIndex === 1 ? "on" : undefined}
          onClick={() => {
            tabChange(1);
          }}
        >
          google
        </button>
        <button
          type="button"
          className={isOnTabIndex === 2 ? "on" : undefined}
          onClick={() => {
            tabChange(2);
          }}
        >
          naver
        </button>
      </div>
      <div className="contents">
        <div className={isOnTabIndex === 0 ? "on" : undefined}>
          {searchData.map((item: any, idx: number) => {
            return (
              <PortalArea key={idx} portalName={item.name} searchData={item} />
            );
          })}
        </div>
        <div className={isOnTabIndex === 1 ? "on" : undefined}>
          {searchData.map((item: any, idx: number) => {
            if (item.name === "google") {
              return (
                <PortalArea key={idx} portalName={item.name} searchData={item} />
              );
            } else {
              return undefined;
            }
          })}
        </div>
        <div className={isOnTabIndex === 2 ? "on" : undefined}>
          {searchData.map((item: any, idx: number) => {
            if (item.name === "naver") {
              return (
                <PortalArea key={idx} portalName={item.name} searchData={item} />
              );
            } else {
              return undefined;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DataTab;
