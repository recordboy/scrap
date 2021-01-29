import React, { useState } from "react";
import InputCheckbox from "./InputCheckbox";
import "./SelectForm.scss";

const SelectForm = (props: {
  portalList: any;
  setIsOnPortal: (id: string, isOn: boolean) => void;
}) => {
  const { portalList, setIsOnPortal } = props;
  const [isOnOption, setIsOnOption] = useState(false);

  return (
    <div className="form-select">
      <button type="button" className="btn" onClick={() => {
        if (!isOnOption) {
          setIsOnOption(true);
        } else {
          setIsOnOption(false);
        }
      }} >option</button>
      <div className={isOnOption ? "inner on" : "inner"}>
        <InputCheckbox
          id="google"
          isOnCheck={portalList[0].google}
          setIsOnPortal={setIsOnPortal}
        />
        <InputCheckbox
          id="naver"
          isOnCheck={portalList[1].naver}
          setIsOnPortal={setIsOnPortal}
        />
      </div>
    </div>
  );
};

export default SelectForm;