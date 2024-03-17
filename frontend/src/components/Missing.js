import { Link } from "react-router-dom"
import '../css/pageNotFound.css';

const Missing = () => {
    return (
        <article className="page-not-found">
        <h1 className="page-not-found__header">Oops!</h1>
        <p className="page-not-found__message">Page Not Found</p>
        <div className="flexGrow page-not-found__link">
          <Link to="/" className="page-not-found__home-link">Visit Our Homepage</Link>
        </div>
      </article>
    )
}

export default Missing
