import React from 'react'
import { Trans } from "react-i18next";
import { Link } from 'react-router-dom';

const SideNav = (props) => (
	<li
		className={props.class ? "nav-item menu-items active" : "nav-item menu-items"}
	>
		<Link
			to='#'
			style={{ position: "relative" }}
			className="nav-link"
			onClick={props.click}
		>
			<span className="menu-icon">
				<i className={props.iconClass}></i>
			</span>
			<span className="menu-title">
				<Trans>{props.transTitle}</Trans>
			</span>
			<i className="fa fa-angle-right"></i>
		</Link>
	</li>
);

export default SideNav;