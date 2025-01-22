import React, { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";
import axios from "axios";
import { Fragment } from "react";
import { BASE_URL_DEV } from "utils";

function GraphFunc(props) {
	const [graphData, setGraphData] = useState([]);
	const [errorText, setErrorText] = useState("");

	useEffect(() => {
		async function fetchData() {
			await axios
				.get(`${BASE_URL_DEV}/api/v1/graph`)

				.then(function (response) {
					setGraphData(response.data);
				})
				.catch(function (error) {
					console.log("error:", error.response)
					setErrorText(error && error.response !== undefined && error.response.statusText);
				});
		}
		fetchData();
	}, []);

	const myConfig = {
		nodeHighlightBehavior: false,
		highlightDegree: 1,
		highlightOpacity: 1,
		linkHighlightBehavior: false,
		maxZoom: 5,
		minZoom: 0.1,
		focusZoom: 1,
		focusAnimationDuration: 0.75,
		nodeHighlightBehavior: false,
		panAndZoom: false,
		staticGraph: false,
		d3: {
			alphaTarget: 0.05,
			gravity: -100,
			linkLength: 100,
			linkStrength: 1
		},
		node: {
			color: "lightgreen",
			size: 120,
			highlightStrokeColor: "blue",
		},
		link: {
			highlightColor: "lightblue",
		},
	};

	const onClickGraph = function (event) {
		//  window.alert('Clicked the graph background');
	};

	const onClickNode = function (nodeId, node) {
		//  window.alert('Clicked node ${nodeId} in position (${node.x}, ${node.y})');
	};

	const onDoubleClickNode = function (nodeId, node) {
		//  window.alert('Double clicked node ${nodeId} in position (${node.x}, ${node.y})');
	};

	const onRightClickNode = function (event, nodeId, node) {
		//  window.alert('Right clicked node ${nodeId} in position (${node.x}, ${node.y})');
	};

	const onMouseOverNode = function (nodeId, node) {
		//  window.alert(`Mouse over node ${nodeId} in position (${node.x}, ${node.y})`);
	};

	const onMouseOutNode = function (nodeId, node) {
		//  window.alert(`Mouse out node ${nodeId} in position (${node.x}, ${node.y})`);
	};

	const onClickLink = function (source, target) {
		//  window.alert(`Clicked link between ${source} and ${target}`);
	};

	const onRightClickLink = function (event, source, target) {
		//  window.alert('Right clicked link between ${source} and ${target}');
	};

	const onMouseOverLink = function (source, target) {
		//  window.alert(`Mouse over in link between ${source} and ${target}`);
	};

	const onMouseOutLink = function (source, target) {
		//  window.alert(`Mouse out link between ${source} and ${target}`);
	};

	const onNodePositionChange = function (nodeId, x, y) {
		//  window.alert(`Node ${nodeId} moved to new position x= ${x} y= ${y}`);
	};

	const onZoomChange = function (previousZoom, newZoom) {
		//  window.alert(`Graph is now zoomed at ${newZoom} from ${previousZoom}`);
	};

	return (
		<Fragment>
			{errorText === "" && (
				<Graph
					id="graph-id"
					data={graphData}
					config={myConfig}
					onClickGraph={onClickGraph}
					onClickNode={onClickNode}
					onDoubleClickNode={onDoubleClickNode}
					onRightClickNode={onRightClickNode}
					onClickLink={onClickLink}
					onRightClickLink={onRightClickLink}
					onMouseOverNode={onMouseOverNode}
					onMouseOutNode={onMouseOutNode}
					onMouseOverLink={onMouseOverLink}
					onMouseOutLink={onMouseOutLink}
					onNodePositionChange={onNodePositionChange}
					onZoomChange={onZoomChange}
				/>
			)}
			{errorText !== "" && <div className="error_text"><p>{errorText}</p></div>}
		</Fragment>
	);
}

export default GraphFunc;
