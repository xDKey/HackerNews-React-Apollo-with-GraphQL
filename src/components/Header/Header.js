import { Link, useHistory } from "react-router-dom"
import './Header.css'
import { AUTH_TOKEN } from '../../constants';
import { useState } from "react";

const Header = () => {
    const [authToken, setAuthToken] = useState(localStorage.getItem(AUTH_TOKEN))
    const history = useHistory()

    return (
        <nav className='header'>
            <p>Hacker News</p>
            <Link to='/' className='header__link'>
                new
            </Link>

            <Link to='/top' className='header__link'>
                top
            </Link>

            {authToken && (
                <Link to='/create' className='header__link'>
                    submit
                </Link>
            )}

            <Link to='/search' className='header__link'>
                search
            </Link>

            {authToken ? (
                <div
                    className="header__link login"
                    onClick={() => {
                        localStorage.removeItem(AUTH_TOKEN);
                        setAuthToken(null)
                        history.push(`/`);
                    }}
                >
                    logout
                </div>
                ) : (
                <Link
                    to="/login"
                    className="header__link login"
                >
                    login
                </Link>
            )}

        </nav>
        )
} 

export default Header