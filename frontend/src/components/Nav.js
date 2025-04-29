import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css'; // We'll style it here

function Nav() {
    const location = useLocation();

    return (
        <div className="bottom-nav">
            <Link to="/" className={location.pathname === "/" ? "nav-item active" : "nav-item"}>
                <i className="bi bi-house-door-fill"></i>
                <span>Home</span>
            </Link>
            <Link to="/admin" className={location.pathname === "/admin" ? "nav-item active" : "nav-item"}>
                <i className="bi bi-person-gear"></i>
                <span>Govt</span>
            </Link>
            <Link to="/farmer" className={location.pathname === "/farmer" ? "nav-item active" : "nav-item"}>
                <i className="bi bi-person"></i>
                <span>Farmer</span>
            </Link>
        </div>
    );
}

export default Nav;
