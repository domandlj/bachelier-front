import React from 'react';
import './Header.css'; // Create a new CSS file for header styling
import NavBar from './NavBar';


function Header({option}) {
  return (
    <div className='header-container'>
    <header className="burning-text">
      <h1>Bachelier</h1>
    </header>
   

    <NavBar option={option}/>

    </div>
  );
}

export default Header;
