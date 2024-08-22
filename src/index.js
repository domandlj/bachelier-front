import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Models from './components/Models';
import Bio from './components/Bio';

import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "/models/:id",  // Add a dynamic parameter "id"
    element: <Models/>,  // This component would render the model details based on the id
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
