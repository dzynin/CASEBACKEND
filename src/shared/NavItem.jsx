import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from "react-i18next";

const NavItem = ({ classProp, onClick, iconClass, transTitle }) => (
    <li className={classProp ? "nav-item menu-items active" : "nav-item menu-items"}>
        <Link to="#" style={{ position: "relative" }} className="nav-link" onClick={onClick}>
            <span className="menu-icon">
                <i className={iconClass}></i>
            </span>
            <span className="menu-title">
                <Trans>{transTitle}</Trans>
            </span>
            <i className="fa fa-angle-right"></i>
        </Link>
    </li>
);

export default NavItem;
