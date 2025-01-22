import React from 'react'
import { Trans } from "react-i18next";
import { Dropdown } from "react-bootstrap";

const Profile = (props) => (
	<li className="nav-item profile">
		<div className="profile-desc">
			<div onClick={props.profileClick} className="cursor-pointer profile-pic">
				<div className="count-indicator">
					<img
						className="img-xs rounded-circle "
						src={require("../images/faces/face0.jpeg")}
						alt="profile"
					/>
					<span className="count bg-success"></span>
				</div>
				<div className="profile-name">
					<h5 className="mb-0 font-weight-normal">
						<Trans>{props.authUser}</Trans>
					</h5>
					<span>
						<Trans>{props.authEmail}</Trans>
					</span>
				</div>
			</div>
			<Dropdown alignRight>
				<Dropdown.Toggle as="a" className="cursor-pointer no-caret">
					<i className="mdi mdi-dots-vertical"></i>
				</Dropdown.Toggle>
				<Dropdown.Menu className="sidebar-dropdown preview-list">
					<a
						href="!#"
						className="dropdown-item preview-item"
						onClick={(evt) => evt.preventDefault()}
					>
						<div className="preview-thumbnail">
							<div className="preview-icon bg-dark2 rounded-circle">
								<i className="mdi mdi-settings text-primary"></i>
							</div>
						</div>
						<div className="preview-item-content">
							<p className="preview-subject ellipsis mb-1 text-small">
								<Trans>Account settings</Trans>
							</p>
						</div>
					</a>
					<div className="dropdown-divider"></div>
					<a
						href="!#"
						className="dropdown-item preview-item"
						onClick={(evt) => evt.preventDefault()}
					>
						<div className="preview-thumbnail">
							<div className="preview-icon bg-dark2 rounded-circle">
								<i className="mdi mdi-onepassword  text-info"></i>
							</div>
						</div>
						<div className="preview-item-content">
							<p className="preview-subject ellipsis mb-1 text-small">
								<Trans>Change Password</Trans>
							</p>
						</div>
					</a>
					<div className="dropdown-divider"></div>
					<a
						href="!#"
						className="dropdown-item preview-item"
						onClick={(evt) => evt.preventDefault()}
					>
						<div className="preview-thumbnail">
							<div className="preview-icon bg-dark2 rounded-circle">
								<i className="mdi mdi-calendar-today text-success"></i>
							</div>
						</div>
						<div className="preview-item-content">
							<p className="preview-subject ellipsis mb-1 text-small">
								<Trans>To-do list</Trans>
							</p>
						</div>
					</a>
				</Dropdown.Menu>
			</Dropdown>
		</div>
	</li>
);

export default Profile;