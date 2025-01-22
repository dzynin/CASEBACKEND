// @flow
import React, { useContext, useState, useEffect } from "react";
import { Col, Row, Tabs, Tab, Card, Button, Modal } from "react-bootstrap";
import axios from "axios";

import { BASE_URL_DEV } from "../utils";
import OpenFileModal from "./OpenFileModal";

import { UserContext } from "../App";

function FeedView() {
	const { state, dispatch } = useContext(UserContext);
	const [key, setKey] = useState("allPosts");
	const [isFetchPosts, setIsFetchPosts] = useState(true);

	const fetchPosts = async () => {
		const auth = state.auth;
		if (!auth) return;
		if (!isFetchPosts) return;
		try {
			const result = await axios(`${BASE_URL_DEV}/get/posts`, {
				headers: {
					"x-access-token": auth.authToken,
				},
			});
			const all_posts = result.data && result.data.allPosts;
			console.log(all_posts);
			if (all_posts) {
				dispatch({
					type: "ALL_POSTS",
					payload: all_posts,
				});
			}
			setIsFetchPosts(false);
		} catch (error) {
			console.log(error);
			console.log(error.response);
			setIsFetchPosts(false);
		}
	};

	useEffect(() => {
		console.log("isFetchPosts: ", isFetchPosts);
		fetchPosts();
	}, [isFetchPosts]);

	return (
		<div
			className="dashboard-view bg-dark2 p-5 text-center"
			style={{ width: "100%", minHeight: "100vh" }}
		>
			<Tabs
				id="controlled-tab-example"
				activeKey={key}
				onSelect={(k) => setKey(k)}
			>
				<Tab eventKey="allPosts" title="All Posts">
					<div>
						{state.allPosts &&
							state.allPosts.map((post) => (
								<SinglePost
									key={post.id}
									currUser={state.auth}
									user={post.user_info}
									filePost={post}
									dispatch={dispatch}
									setIsFetchPosts={setIsFetchPosts}
								/>
							))}
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}

function SinglePost({ currUser, user, filePost, dispatch, setIsFetchPosts }) {
	const [showRating, setShowRating] = useState(false);
	const [showRatingsModal, setShowRatingsModal] = useState(false);

	const [showFileModal, setShowFileModal] = useState(false);

	return (
		<Card className="bg-file-card my-2 p-3">
			{user && (
				<Row>
					<Col md={5} sm={12}>
						<Row>
							<Col
								className="d-flex align-items-center justify-content-center"
								md={5}
								sm={12}
							>
								<div className="user-avatar mb-auto mr-3">
									<div className="rounded-circle d-flex bg-dark2 align-items-center justify-content-center img-lg">
										<i className="mdi mdi-file display-1 text-primary"></i>
									</div>
								</div>
							</Col>
							<Col md={7} sm={12}>
								<div className="wrapper">
									<div className="wrapper d-flex align-items-center flex-column">
										<h4 className="mb-1 font-weight-medium">
											{filePost.fileName}
										</h4>
										<div className="wrapper d-flex align-items-center font-weight-medium text-light">
											<i className="mdi mdi-account mr-2"></i>
											<p className="mb-0">{`${user.username}`}</p>
										</div>
										<div className="wrapper d-flex align-items-center font-weight-medium text-light">
											<i className="mdi mdi-email-outline icon-sm mr-2"></i>
											<p className="mb-0 font-weight-medium">{user.email}</p>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Col>
					<Col className="d-flex align-items-center" md={3} sm={5} xs={12}>
						<div className="d-flex align-items-center flex-column text-center">
							<div className="wrapper d-flex align-items-center font-weight-medium text-light">
								{Array(Math.floor(Number(filePost.total_rating)))
									.fill()
									.map((_, idx) => (
										<i
											key={idx}
											style={{ color: "#19a2f7", fontSize: "1.7rem" }}
											className="mdi mdi-star icon-sm mr-2"
										></i>
									))}
								{Array(5 - Math.floor(Number(filePost.total_rating)))
									.fill()
									.map((_, idx) => (
										<i
											key={idx}
											style={{ fontSize: "1.7rem" }}
											className="mdi mdi-star icon-sm mr-2"
										></i>
									))}
							</div>
							<div className="wrapper d-flex align-items-center font-weight-medium text-light">
								{filePost.total_rating > 0 && (
									<p className="mb-0 display-5 font-weight-medium">{`${filePost.total_rating} Star Rating`}</p>
								)}
								{filePost.total_rating == 0 && (
									<p className="mb-0 display-5 font-weight-medium">
										No ratings
									</p>
								)}
							</div>
							{filePost.total_rating > 0 && (
								<div className="wrapper d-flex align-items-center font-weight-medium text-light">
									<p
										onClick={() => setShowRatingsModal(true)}
										className="mb-0 text-primary cursor-pointer"
									>
										View all ratings
									</p>
								</div>
							)}
						</div>
					</Col>
					<Col md={4} sm={7} xs={12}>
						<div
							style={{ height: "100%" }}
							className="d-flex align-items-center text-center"
						>
							<Button
								disabled={
									currUser.userPublicId == user.public_id ? true : false
								}
								onClick={() => setShowRating(true)}
								className="btn btn-primary rounded-0 mr-3 p-2 h3"
							>
								Add Your Rating
							</Button>
							<Button
								onClick={() => setShowFileModal(true)}
								className="btn btn-primary rounded-0 py-2 px-3 h3"
							>
								Open File
							</Button>
						</div>
						<RatingModal
							show={showRating}
							setShow={setShowRating}
							auth={currUser}
							dispatch={dispatch}
							setIsFetchPosts={setIsFetchPosts}
							filePost={filePost}
						/>
						<ShowRatingsModal
							show={showRatingsModal}
							setShow={setShowRatingsModal}
							ratings={filePost.all_ratings}
						/>
						{/* <OpenFileModal
							showFileModal={showFileModal}
							setShowFileModal={setShowFileModal}
							fileUrl={filePost.fileUrl}
							filePost={filePost}
						/> */}
					</Col>
				</Row>
			)}
		</Card>
	);
}

function RatingModal({
	filePost,
	show,
	setShow,
	auth,
	dispatch,
	setIsFetchPosts,
}) {
	const handleClose = () => {
		setShow(false);
	};
	const [message, setMessage] = useState("");
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");

	const handleRating = async () => {
		try {
			const result = await axios.post(
				`${BASE_URL_DEV}/rating/create`,
				{
					rating,
					review,
					post_id: filePost.id,
				},
				{
					headers: {
						"x-access-token": auth.authToken,
					},
				}
			);
			console.log(result.data);
			setIsFetchPosts(true);
			handleClose();
		} catch (error) {
			console.log(error);
			if (error.response && error.response.data.message)
				setMessage(error.response.data.message);
			else setMessage(error.message);
		}
	};

	const isRated = filePost.all_ratings
		? !!filePost.all_ratings.filter((rating) => rating.user_id === auth.userId)
			.length
		: false;

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Body>
					{!isRated ? (
						<div>
							<div className="h3 text-dark my-3">
								{Array(rating)
									.fill()
									.map((_, idx) => (
										<i
											key={idx}
											style={{ fontSize: "1.7rem", color: "#19a2f7" }}
											onClick={() => setRating(idx + 1)}
											className="mdi mdi-star icon-sm mr-2 cursor-pointer"
										></i>
									))}
								{Array(5 - rating)
									.fill()
									.map((_, idx) => (
										<i
											key={idx}
											style={{ fontSize: "1.7rem" }}
											onClick={() => setRating(rating + idx + 1)}
											className="mdi mdi-star icon-sm mr-2 cursor-pointer"
										></i>
									))}
							</div>
							<div className="form-group w-100">
								<label className="text-dark">Add Review</label>
								<textarea
									onChange={(e) => setReview(e.target.value)}
									className="form-control text-light"
									value={review}
									rows="3"
								></textarea>
							</div>
							{message && (
								<div className="text-center text-dark my-3">{message}</div>
							)}
						</div>
					) : (
						<div className="h4 text-center text-dark">
							You already rated this post!
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					{!isRated && (
						<Button variant="primary" onClick={() => handleRating()}>
							Add Rating
						</Button>
					)}
				</Modal.Footer>
			</Modal>
		</>
	);
}

function ShowRatingsModal({ ratings, show, setShow }) {
	const handleClose = () => {
		setShow(false);
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
					{ratings &&
						ratings.map((item, i) => (
							<div key={i}>
								<div className="h4 text-dark mt-2">
									{Array(item.rating)
										.fill()
										.map((_, idx) => (
											<i
												key={idx}
												style={{ fontSize: "1.7rem", color: "#19a2f7" }}
												className="mdi mdi-star icon-sm mr-2"
											></i>
										))}
									{Array(5 - item.rating)
										.fill()
										.map((_, idx) => (
											<i
												key={idx}
												style={{ fontSize: "1.7rem" }}
												className="mdi mdi-star icon-sm mr-2"
											></i>
										))}
								</div>
								<div className="h4 mt-0 w-100 text-dark">{item.review}</div>
								{(i !== (ratings.length - 1)) && <hr className="bg-dark2" />}
							</div>
						))}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default FeedView;
