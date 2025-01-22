// @flow
import React, { useContext, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Modal, Button } from "react-bootstrap";
import { UserContext } from "../App";
import { BASE_URL_DEV } from "../utils";

function ProfileView() {
	const { state, dispatch } = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const [shareFile, setShareFile] = useState(null);
	const { auth } = state;

	const handleFileShare = (fileName) => {
		setShowModal(true);
		setShareFile(fileName);
		console.log(fileName);
	};

	return (
		<div
			className="dashboard-view bg-dark2 p-5"
			style={{ width: "100%", minHeight: "100vh" }}
		>
			{auth && (
				<Card className="p-5" style={{ background: "#191c24" }}>
					<Row>
						<Col md={6} xs={12} sm={12}>
							<div>
								<div className="text-center mb-3">
									<img
										style={{
											height: "100px",
											width: "100px",
										}}
										src={require("../images/faces/face0.jpeg")}
										className="rounded-circle"
										alt="face"
									/>
									<div className="my-3">
										<h3>{`${auth.fname} ${auth.lname}`}</h3>
										<h5 className="profile-text-dark">{auth.email}</h5>
									</div>
								</div>

								<hr className="bg-dark2 mb-0 mt-4" />
								<div className="p-2">
									<div className="h3 mb-0">Profile info</div>
								</div>
								<hr className="bg-dark2 mt-0" />
								<div className="px-3">
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">Username</div>
										<div className="h4 profile-text-dark">
											<em>{`@${auth.username}`}</em>
										</div>
									</div>
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">Name</div>
										<div className="h4 profile-text-dark">{`${auth.fname} ${auth.lname}`}</div>
									</div>
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">Email</div>
										<div className="h4 profile-text-dark">{auth.email}</div>
									</div>
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">Organisation</div>
										<div className="h4 profile-text-dark">
											{auth.organisation}
										</div>
									</div>
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">City</div>
										<div className="h4 profile-text-dark">{auth.city}</div>
									</div>
									<div className="d-flex justify-content-between">
										<div className="h4 text-white">Country</div>
										<div className="h4 profile-text-dark">{auth.country}</div>
									</div>
									<hr />
								
								</div>
							</div>
						</Col>
						<Col md={6} xs={12} sm={12}>
							<Card
								style={{ height: "100%" }}
								className="bg-dark2 text-center p-3"
							>
								<Card.Header className="h3 p-0">
									My Files
									<hr className="bg-light" />
								</Card.Header>
								<Card.Body className="p-0">
									{state.files && state.files.length > 0 ? (
										state.files.map((pdf, index) => (
											<div
												key={index}
												className="bg-secondary rounded-0 d-flex align-items-center justify-content-between py-2 px-3 my-1 mb-2"
											>
												<p style={{ margin: 0 }}>{pdf.name}</p>
												<span
													onClick={() => handleFileShare(pdf.name)}
													className="profile-icon d-flex justify-content-center align-items-center"
												>
													<i className="mdi mdi-share"></i>
												</span>
											</div>
										))
									) : (
										<div className="w-100 p-2">
											<p style={{ margin: 0 }}>No Pdfs uploaded!</p>
										</div>
									)}
									<FileShareModal
										filename={shareFile}
										show={showModal}
										setShow={setShowModal}
										setFile={setShareFile}
										auth={state.auth}
										dispatch={dispatch}
									/>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Card>
			)}
		</div>
	);
}

function FileShareModal({ filename, show, setShow, setFile, auth, dispatch }) {
	const handleClose = () => {
		setFile(null);
		setShow(false);
	};
	const [message, setMessage] = useState("");

	const handleShare = async () => {
		console.log(`Sharing File ${filename}`);
		try {
			const result = await axios(
				`${BASE_URL_DEV}/file/share/${auth.userPublicId}/${filename}`,
				{
					headers: {
						"x-access-token": auth.authToken,
					},
				}
			);
			const createdPost = result.data && result.data.post;
			console.log(createdPost);
			if (createdPost) {
				dispatch({
					type: "ADD_My_POSTS",
					payload: createdPost,
				});
			}
			handleClose();
		} catch (error) {
			console.log(error);
			if (error.response && error.response.data.message) setMessage(error.response.data.message);
			else setMessage(error.message);
		}
	};

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Body>
					<div className="h3 text-center text-dark my-3">{`Share ${filename}?`}</div>
					{message && (
						<div className="text-center text-dark my-3">{message}</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={() => handleShare()}>
						Share
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default ProfileView;
