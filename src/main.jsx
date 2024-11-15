import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root from "./routes/root";
import Index from './routes/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorPage from './routes/errorPage.jsx';
import BrowseAllCards from './routes/browseallcards.jsx';
import Collection from './routes/collection.jsx';
import Wishlist from './routes/wishlist.jsx';
import Deckbuilder from './routes/deckbuilder.jsx';
import Decks from './routes/decks.jsx';

/**
 * 
 * main.jsx
 * 
 * Uses react router. Routes are defined here, and the root is created.
 * 
 * 
 */


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "index",
        element: <Index />,
      }, {
        path: "browseallcards",
        element: <BrowseAllCards />,
      }, {
        path: "collection",
        element: <Collection />,
      }, {
        path: "wishlist",
        element: <Wishlist />,
      }, {
        path: "deckbuilder",
        element: <Deckbuilder />,
      }, {
        path: "decks",
        element: <Decks />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
