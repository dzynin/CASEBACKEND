// @flow

// Based on https://github.com/agentcooper/react-pdf-highlighter/tree/master/packages/example
// rewritten with hooks

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
	PdfLoader,
	PdfHighlighter,
	Highlight,
	Popup,
	AreaHighlight,
} from "react-pdf-highlighter";
import Spinner from "../shared/Spinner";
import Tip from "./Tip";
import processMd from "./markdown";
import { Fragment } from "react";
import GraphFunc from "./graphFunc";
import PdfViewer from "./PdfViewer";
import DashboardView from "./DashboardView";
import ProfileView from "./ProfileView";
import FeedView from "./FeedView";
import LawsViewer from "./LawsViewer";
import TextAnonymizer from "./TextAnonymizer";
import GptView from "./GptView"


const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
	document.location.hash.slice("#highlight-".length);

const resetHash = () => {
	document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
	comment.text ? (
		<div className="Highlight__popup">
			{comment.emoji} {processMd(comment.text)}
		</div>
	) : null;

//const DEFAULT_URL = "https://arxiv.org/pdf/1708.08021.pdf";

//const searchParams = new URLSearchParams(document.location.search);
//const url = searchParams.get("url") || DEFAULT_URL;

function Dashboard({ showFileViewer, showDashboardView, showHighlight, showProfileView, showFeedView, showTextAnonymizerView, showGptView, showLawsReader }) {
	const [state, setState] = useState({ highlights: [] });
	const [PdfUrl, setPdfUrl] = useState({ url: "" });

	/* commented off because it seems to be pinging on first dashboard view , no need for now , deprecated usage */
	// useEffect(() => {
	// 	async function fetchData() {
	// 		axios.get('http://127.0.0.1:5000/api/v1/json')
	// 			.then(result_json => {
	// 				const pdf_name = Object.keys(result_json.data)[0];
	// 				setPdfUrl({ url: `http://127.0.0.1:5000/api/v1/pdf/${pdf_name}` });
	// 				setState({ highlights: result_json.data[pdf_name] });
	// 			})
	// 			.catch(error => console.log('error: ' + error));
	// 	}
	// 	fetchData();
	// }, []);
	// not using the State type!

	// Jumping to highlight

	// This function was defined and changed later! I'm not sure why it was used instead of a ref
	// let scrollViewerTo = (highlight: any) => { };
	// https://stackoverflow.com/questions/24841855/how-to-access-component-methods-from-outside-in-reactjs

	const pdfHighlighter = useRef(null);
	const getHighlightById = (id) =>
		state.highlights.find((highlight) => highlight.id === id);
	const scrollToHighlightFromHash = () => {
		const highlight = getHighlightById(parseIdFromHash());
		if (highlight) {
			pdfHighlighter.current.scrollTo(highlight);
		}
	};

	useEffect(() => {
		window.addEventListener("hashchange", scrollToHighlightFromHash, false);

		return () =>
			window.removeEventListener("hashchange", scrollToHighlightFromHash);
	});

	function addHighlight(highlight) {
		const { highlights } = state;

		setState({
			highlights: [{ ...highlight, id: getNextId() }, ...highlights],
		});
	}

	function updateHighlight(
		highlightId,
		position,
		content
	) {
		setState({
			highlights: state.highlights.map((h) => {
				return h.id === highlightId
					? {
						...h,
						position: { ...h.position, ...position },
						content: { ...h.content, ...content },
					}
					: h;
			}),
		});
	}

	const { highlights } = state;
	const { url } = PdfUrl;

	return (
		<Fragment>
			{showHighlight && (
				<>
					<GraphFunc />
					{url ? (
						<PdfLoader url={url} beforeLoad={<Spinner />}>
							{(pdfDocument) => (
								<PdfHighlighter
									ref={pdfHighlighter}
									pdfDocument={pdfDocument}
									enableAreaSelection={(event) => event.altKey}
									onScrollChange={resetHash}
									scrollRef={(scrollTo) => { }}
									onSelectionFinished={(
										position,
										content,
										hideTipAndSelection,
										transformSelection
									) => (
										<Tip
											onOpen={transformSelection}
											onConfirm={(comment) => {
												addHighlight({ content, position, comment });

												hideTipAndSelection();
											}}
										/>
									)}
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
												onChange={(boundingRect) => {
													updateHighlight(
														highlight.id,
														{
															boundingRect: viewportToScaled(boundingRect),
														},
														{ image: screenshot(boundingRect) }
													);
												}}
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
					) : (
						<Spinner />
					)}
				</>
			)}
			{showFileViewer && <PdfViewer />}
			{showDashboardView && <DashboardView />}
			{showProfileView && <ProfileView />}
			{showFeedView && <FeedView />}
			{showLawsReader && <LawsViewer />}
			{showTextAnonymizerView && <TextAnonymizer />}
			{showGptView && <GptView />}
		</Fragment>
	);
}

export default Dashboard;
