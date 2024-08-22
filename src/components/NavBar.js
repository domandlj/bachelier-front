import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file
import SquareButton from './SquareButton';

function NavBar({option}) {
  return (
    <nav className="navbar">
      <ul>
        
        <li>
        <Link to="/" >
        <SquareButton selected={option==="Main"} text={"Main"} />
        </Link>
      
        </li>

        <li>
        <Link to="/models" >
        <SquareButton selected={option==="Models"}  text={"Boxes"} />
        </Link>
      
        </li>



        
        
        <li>
        <Link to="/bio">
        <SquareButton code={true} selected={option==="whoami"} text={"whoami"}/>
        </Link>
        </li>

 
      </ul>
    </nav>
  );
}

export default NavBar;
