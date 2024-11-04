import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root from "./routes/root";

import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    </StrictMode>,
)
