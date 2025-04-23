import React from 'react';
import './SquareButton.css'; // Import the CSS file for your button styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SquareButton({ selected, share, code, text, onClick, icon, textOnly }) {
  let style = "square-button";
  if (selected) {
    style = textOnly ? "text-button-selected" : "square-button-selected";
  } else if (share) {
    style = "square-button-share";
  } else if (textOnly) {
    style = "text-button";
  }

  return (
    <button className={style} onClick={onClick}>
      {code ? (
        <code>{text}</code>
      ) : (
        <div>
          {icon && <FontAwesomeIcon icon={icon} />}
          {text}
        </div>
      )}
    </button>
  );
}
export default SquareButton;

