
import React from "react";
import "./Loading.scss";

const Loading = (props: { isOnLoading: boolean }) => {
    const { isOnLoading } = props;
    return (
        <div
            className="loading"
            style={{ display: isOnLoading ? "block" : "none" }}
        >
            <div className="inner">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Loading;