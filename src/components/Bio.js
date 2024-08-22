import React from 'react';
import './Bio.css';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'; // Import GitHub icon
import "@fontsource/montserrat"; // Import Montserrat font

function Bio() {
  return (
    <div>
      <Header option={"whoami"} />
      <div className="bio-container">
        <div className="bio-content">
          <h2>About Me</h2>

          <p className="bio-text">
            I'm Juan Domandl 🇦🇷, I like computers and maths.
          </p>
          <p className="bio-text">
            <FontAwesomeIcon icon={faEnvelope} /> juan.domandl@mi.unc.edu.com.ar
          </p>
          <p className="bio-text">
            <FontAwesomeIcon icon={faGithub} /> https://github.com/domandlj
          </p>
        </div>
      </div>
    </div>
  );
}

export default Bio;
