import React from "react";
import "./InputCheckbox.scss";

const InputCheckbox = (props: {
  id: string;
  isOnCheck: boolean;
  setIsOnPortal: (id: string, isOn: boolean) => void;
}) => {
  const { id, isOnCheck, setIsOnPortal } = props;

  return (
    <div className="checkbox">
      <input
        id={id}
        type="checkbox"
        defaultChecked={isOnCheck}
        onChange={(e) => {
          setIsOnPortal(id, e.target.checked);
        }}
      />
      <label htmlFor={id}></label>
    </div>
  );
};

export default InputCheckbox;