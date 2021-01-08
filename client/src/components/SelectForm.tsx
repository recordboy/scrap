import React from "react";
import InputCheckbox from "./InputCheckbox";
import "./SelectForm.scss";

const SelectForm = (props: {
  portalList: any;
  setIsOnPortal: (id: string, isOn: boolean) => void;
}) => {
  const { portalList, setIsOnPortal } = props;

  return (
    <div className="form-select">
      <InputCheckbox id="google" isOnCheck={portalList[0].google} setIsOnPortal={setIsOnPortal} />
      <InputCheckbox id="naver" isOnCheck={portalList[1].naver} setIsOnPortal={setIsOnPortal} />
    </div>
  );
};

export default SelectForm;