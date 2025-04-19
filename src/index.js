import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Models from './components/Models';
import Bio from './components/Bio';
import Reports from './components/Reports';
import reportWebVitals from './reportWebVitals';

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/bio",
    element: <Bio />,
  },
  {
    path: "/models",
    element: <Models/>,
  },
  {
    path: "/models/:id",
    element: <Models/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();