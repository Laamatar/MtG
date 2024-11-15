import { useRouteError } from "react-router-dom";

/**
 * 
 * errorPage.jsx
 * 
 * Screen that shows an error if something is wrong with the routing.
 * 
 * 
 */


export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="my-4 mx-4">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>Error: {error.statusText || error.message}</i>
      </p>
    </div>
  );
}