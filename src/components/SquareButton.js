import React from 'react';
import './SquareButton.css'; // Import the CSS file for your button styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SquareButton({selected, share, code, text, onClick, icon }) {
  let style = "square-button";
  if (selected) {
    style = "square-button-selected";
  }
  if (share) {
    style = "square-button-share";
  };

  return (
    
    <button className={style} onClick={onClick}>
      {
        code ?
        <code>{text}</code> :
        (<div><FontAwesomeIcon icon={icon} />{text}</div>)
      }
    </button>
  );
}

export default SquareButton;