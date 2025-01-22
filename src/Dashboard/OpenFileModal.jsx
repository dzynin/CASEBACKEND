import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import {
	PdfLoader,
	PdfHighlighter,
	Highlight,
	Popup,
	AreaHighlight,
} from "react-pdf-highlighter";
import { BASE_URL_DEV } from "../utils";

import Spinner from "../shared/Spinner";
import processMd from "./markdown";

const updateHash = (highlight) => {
	document.location.hash = `file-highlight-${highlight.id}`;
};
const parseIdFromHash = () =>
	document.location.hash.slice("#file-highlight-".length);

const resetHash = () => {
	document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
	comment.text ? (
		<div className="Highlight__popup">
			{comment.emoji} {processMd(comment.text)}
		</div>
	) : null;

function OpenFileModal({ showFileModal, setShowFileModal, filePost }) {
	const handleClose = () => {
		setShowFileModal(false);
	};

	const pdfHighlighter = useRef(null);

	const { fileUrl, fileName } = filePost;

	const [highlights, setHighlights] = useState([]);

	const url = `${BASE_URL_DEV}/${fileUrl}`;

	const fetchHighlights = async () => {
		const result = await axios(
			`${BASE_URL_DEV}/highlights-json/${filePost.user_info && filePost.user_info.public_id
			}/${fileName}`
		);
		const fileHighlights = result.data;
		console.log("fileHighlights: ");
		console.log(fileHighlights);
		if (fileHighlights && fileHighlights.highlights) {
			console.log(fileHighlights.highlights);
			setHighlights(
				fileHighlights.highlights && fileHighlights.highlights.highlights
			);
		}
	};

	useEffect(() => {
		fetchHighlights();
	}, []);

	const getHighlightById = (id) =>
		highlights.find((highlight) => highlight.id === id);
	const scrollToHighlightFromHash = () => {
		const highlight = getHighlightById(parseIdFromHash());
		console.log(highlight);
		if (highlight && pdfHighlighter.current) {
			console.log(pdfHighlighter);
			pdfHighlighter.current.scrollTo(highlight);
		}
	};

	useEffect(() => {
		window.addEventListener("hashchange", scrollToHighlightFromHash, false);

		return () =>
			window.removeEventListener("hashchange", scrollToHighlightFromHash);
	});

	return (
		<>
			<Modal
				show={showFileModal || false}
				onHide={handleClose}
				size="xl"
				style={{
					width: "85vw", height: "1250px",
					margin: 'auto'
				}}
			>
				<Modal.Body
					style={{
						color: "#000000",
						zIndex: "100",
						overflow: "hidden",
					}}
				>
					<div className="d-flex w-100">
						<div
							className="sidebarnew"
							style={{
								width: "25%",
								minWidth: "20%",
								height: "calc(100vh - 70px)",
								overflowY: "scroll",
							}}
						>
							<div className="description" style={{ padding: "1rem" }}>
								<h2 style={{ marginBottom: "1rem" }}>CASEVIEWER</h2>
								<p>
									<small>
										To create area highlight hold ⌥ Option key (Alt), then click
										and drag.
									</small>
								</p>
							</div>

							<ul className="sidebar__highlights">
								{highlights.length > 0 ? (
									highlights.map((highlight, index) => (
										<li
											key={index}
											className="sidebar__highlight"
											onClick={() => {
												updateHash(highlight);
											}}
										>
											<div>
												<strong>{processMd(highlight.comment.text)}</strong>
												{highlight.content.text ? (
													<blockquote style={{ marginTop: "0.5rem" }}>
														{`${highlight.content.text.slice(0, 90).trim()}…`}
													</blockquote>
												) : null}
												{highlight.content.image ? (
													<div
														className="highlight__image"
														style={{ marginTop: "0.5rem" }}
													>
														<img
															src={highlight.content.image}
															alt={"Screenshot"}
														/>
													</div>
												) : null}
											</div>
											<div className="highlight__location">
												Page {highlight.position.pageNumber}
											</div>
										</li>
									))
								) : (
									<li className="sidebar__highlight">
										<div className="p-2">
											<p style={{ margin: 0 }}>
												No Highlights Available for this Pdf!
											</p>
										</div>
									</li>
								)}
							</ul>
						</div>
						<div className="w-75">
							{url && (
								<PdfLoader
									className="my-pdf-viewer"
									url={url}
									beforeLoad={<Spinner />}
								>
									{(pdfDocument) => (
										<PdfHighlighter
											ref={pdfHighlighter}
											pdfDocument={pdfDocument}
											enableAreaSelection={(event) => event.altKey}
											onScrollChange={resetHash}
											scrollRef={(scrollTo) => { }}
											highlightTransform={(
												highlight,
												index,
												setTip,
												hideTip,
												viewportToScaled,
												screenshot,
												isScrolledTo
											) => {
												const isTextHighlight = !Boolean(
													highlight.content && highlight.content.image
												);

												const component = isTextHighlight ? (
													<Highlight
														isScrolledTo={isScrolledTo}
														position={highlight.position}
														comment={highlight.comment}
													/>
												) : (
													<AreaHighlight
														highlight={highlight}
														onChange={(boundingRect) => { }}
													/>
												);

												return (
													<Popup
														popupContent={<HighlightPopup {...highlight} />}
														onMouseOver={(popupContent) =>
															setTip(highlight, (highlight) => popupContent)
														}
														onMouseOut={hideTip}
														key={index}
														children={component}
													/>
												);
											}}
											highlights={highlights}
										/>
									)}
								</PdfLoader>
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default OpenFileModal;
