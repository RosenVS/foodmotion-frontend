import { useNavigate,browserHistory } from "react-router-dom"
import '../css/pageNotFound.css';
import { Link } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => {
    navigate(-3)
    }

    return (
        <article className="page-not-found">
        <h1 className="page-not-found__header">Unauthorized</h1>
        <p className="page-not-found__message">You do not have access to the requested page.</p>
        <div className="flexGrow page-not-found__link">
          <Link  onClick={goBack}className="page-not-found__home-link">Go back</Link>
        </div>
      </article>
      
    )
}

export default Unauthorized
