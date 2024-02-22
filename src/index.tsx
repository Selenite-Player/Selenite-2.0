import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import Browse from './Browse';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <App />,
  },
  {
    path: "/index.html/browse",
    element: <Browse />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
