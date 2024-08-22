// Models.js

import './Models.css';
import React, { useState } from 'react';
import Header from './Header';
//import Footer from './Footer';
import CodeEditor from './CodeEditor';
import { useParams } from "react-router-dom";

function Models() {
  const [code, setCode] = useState('// Write your code here...');
  const { id } = useParams();  // Get the "id" from the URL

  return (
    <div>
      <Header option={"Models"} />
      <div className="model-container">
        <CodeEditor id={id} code={code} onChange={setCode} />
      </div>
    </div>
  );
}

export default Models;
