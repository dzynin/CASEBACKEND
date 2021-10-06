// @flow
import React, { useContext, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { UserContext } from "../App";
import { Resizable } from "react-resizable";
import processMd from "./markdown";
import "../style/resizable.css";

const updateHash = (highlight) => {
	document.location.hash = `pdf-highlight-${highlight.id}`;
};

function FileViewer() {
	const { state, dispatch } = useContext(UserContext);

	const [highlights, setHighlights] = useState([]);
	const [dimensions, setDimensions] = useState({
		height: 720,
		width: 250,
	});
	const [selectPdf, setSelectPdf] = useState(false);

	useEffect(() => {
		if (state.currentFile) {
			let highlightUpdated = false;
			state.fileHighlights.forEach((item) => {
				if (item.name === state.currentFile.name) {
					setHighlights(item.highlights);
					highlightUpdated = true;
				}
			});
			if (!highlightUpdated) setHighlights([]);
		}
	}, [state.currentFile, state.fileHighlights]);

	const handleFileClick = async (index) => {
		dispatch({ type: "SET_CURR_FILE", payload: state.files[index] });
		dispatch({ type: "SET_MODAL", payload: false });
		setSelectPdf(false);
	};

	const deleteHighlight = (index) => {
		const updatedHighlights = highlights.filter((highlight, idx) => (
			index !== idx ? highlight : null
		));
		setHighlights(updatedHighlights);
	};

	const hideModal = () => {
		setSelectPdf(false);
		dispatch({ type: "SET_MODAL", payload: false });
	}

	const resetHighlights = () => {
		setHighlights([]);
	};

	return (
		<Resizable
			className="box"
			height={dimensions.height}
			axis="x"
			width={dimensions.width}
			onResize={(e, { size }) => {
				setDimensions({
					height: size.height,
					width: size.width,
				});
			}}
			resizeHandles={["e"]}
		>
			<div
				className="sidebarnew"
				style={{
					width: dimensions.width + 'px' || "25%",
					// minWidth: "20%",
					// height: dimensions.height + 'px' || "calc(100vh - 70px)",
					height:'100vh',
					overflowY: "scroll",
				}}
			>
				<div className="description" style={{ padding: "1rem" }}>
					<h2 style={{ marginBottom: "1rem" }}>Smart Law Viewer </h2>
					<p>
						<small>
							To create your own highlights hold ⌥ Option key (Alt), then click and
							drag.
						</small>
					</p>
				</div>

				<ul className="sidebar__highlights">
					<li
						className="btn btn-md btn btn-outline-light text-center bg-secondary cursor-pointer my-5 mb-0 p-3"
						onClick={() => setSelectPdf(true)}
					>
						Select Another File
					</li>
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
									<div style={{ padding: "4px" }}>
										<button
											style={{ float: "right" }}
											onClick={() => deleteHighlight(index)}
											className="sidebar__btn"
										>
											<i className="fa fa-close"></i>
										</button>
									</div>
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
											<img src={highlight.content.image} alt={"Screenshot"} />
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
									No Highlights Available for Selected Pdf!
								</p>
							</div>
						</li>
					)}
				</ul>
				{highlights.length > 0 ? (
					<div style={{ padding: "1rem" }}>
						<button onClick={resetHighlights}>Reset highlights</button>
					</div>
				) : null}
				<Modal
					style={{ color: "#050505" }}
					show={selectPdf || state.isModalOpen}
					onHide={() => hideModal()}
					backdrop="static"
					size="md"
					centered={true}
				>
					<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-sm">
							Select File
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						<div className="card">
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover">
										<thead>
											<tr>
												<th>PDF Name</th>
												{/* <th>Last Modified</th> */}
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{state.files && state.files.length > 0 ? (
												state.files.map((pdf, index) => (
													state.currentFile.name === pdf.name ? (
														<tr style={{ backgroundColor: "rgba(0, 0, 0, 0.075)", color: "#212529" }} key={index}>
															<td>{pdf.name}</td>
															{/* <td>N/A</td> */}
															<td className="text-danger"><button type="button" onClick={() => handleFileClick(index)} className="btn btn-info btn-sm">View File</button></td>
														</tr>
													) : (
														<tr key={index}>
															<td>{pdf.name}</td>
															{/* <td>N/A</td> */}
															<td className="text-danger"><button type="button" onClick={() => handleFileClick(index)} className="btn btn-info btn-sm">View File</button></td>
														</tr>
													)

												))) : (
												<tr>
													<td colspan="2" align="center"><p style={{ margin: "10px 0px 0px 0px" }}>No Pdfs uploaded!</p></td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			</div>
		</Resizable>
	);
}

export default FileViewer;
