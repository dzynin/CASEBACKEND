import React, { useEffect, useState, useContext } from "react";
import { Graph } from "react-d3-graph";
import axios from "axios";
import { Fragment } from "react";
import { UserContext } from "../App";

function GraphFunc(props) {
	const [errorText, setErrorText] = useState("");
	const { state, dispatch } = useContext(UserContext);

	console.log('graphFunc!!!');
	useEffect(() => {
		async function fetchData() {
			await axios
				.get("http://127.0.0.1:5000/api/v1/graph", {
					params: {
						search_query: state.searchQuery
					}
				})
				.then(function (response) {
					console.log(response);
					dispatch({ type: "SET_NODES_DATA", payload: response.data.nodes_data })
					dispatch({ type: "SET_GRAPH_DATA", payload: response.data.graph_data })

				})
				.catch(function (error) {
					setErrorText(error && error.response !== undefined && error.response.statusText);
				});
		}
		if (state.searchQuery !== "") {
			fetchData();
		}
	}, [state.searchQuery]);

	const myConfig = {
		"automaticRearrangeAfterDropNode": true,
		"collapsible": false,
		"directed": false,
		"focusAnimationDuration": 0,
		"focusZoom": 1,
		"freezeAllDragEvents": false,
		"height": 700,
		"highlightDegree": 0.5,
		"highlightOpacity": 1,
		"linkHighlightBehavior": true,
		"maxZoom": 8,
		"minZoom": 0.1,
		"nodeHighlightBehavior": true,
		"panAndZoom": false,
		"staticGraph": false,
		"staticGraphWithDragAndDrop": false,
		"width": 800,
		"d3": {
			"alphaTarget": 0.05,
			"gravity": -100,
			"linkLength": 10,
			"linkStrength": 1,
			"disableLinkForce": false
		},
		"node": {
			"color": "#d3d3d3",
			"fontColor": "black",
			"fontSize": 8,
			"fontWeight": "normal",
			"highlightColor": "lightgreen",
			"highlightFontSize": 16,
			"highlightFontWeight": "normal",
			"highlightStrokeColor": "SAME",
			"highlightStrokeWidth": "SAME",
			"labelProperty": "id",
			"mouseCursor": "pointer",
			"opacity": 1,
			"renderLabel": true,
			"size": 200,
			"strokeColor": "none",
			"strokeWidth": 1.5,
			"svg": "",
			"symbolType": "circle",
		},
		"link": {
			"color": "#d3d3d3",
			"fontColor": "black",
			"fontSize": 8,
			"fontWeight": "normal",
			"highlightColor": "SAME",
			"highlightFontSize": 8,
			"highlightFontWeight": "normal",
			"labelProperty": "label",
			"mouseCursor": "pointer",
			"opacity": 1,
			"renderLabel": false,
			"semanticStrokeWidth": false,
			"strokeWidth": 1.5,
			"markerHeight": 6,
			"markerWidth": 6,
			"strokeDasharray": 0,
			"strokeDashoffset": 0,
			"strokeLinecap": "butt"
		}
	};

	const onClickGraph = function (event) {
		//  window.alert('Clicked the graph background');
	};

	const onClickNode = function (nodeId, node) {
		// window.alert(`Clicked node ${nodeId} in position (${node.x}, ${node.y})`);
	};

	const onDoubleClickNode = function (nodeId, node) {
		//  window.alert('Double clicked node ${nodeId} in position (${node.x}, ${node.y})');
		const nodeData = state.nodesData[nodeId]
		if (nodeData) {
			window.open(nodeData["frontend_url"], '_blank');
		}
	};

	const onRightClickNode = function (event, nodeId, node) {
		//  window.alert('Right clicked node ${nodeId} in position (${node.x}, ${node.y})');
	};

	const onMouseOverNode = function (nodeId, node) {
		//  window.alert(`Mouse over node ${nodeId} in position (${node.x}, ${node.y})`);
		const nodeData = state.nodesData[node.id]
		if (nodeData) {
			dispatch({ type: "SET_NODE_DATA", payload: nodeData })
			let nodes = state.graphData.nodes.map(n => {
				if (n.id === node.id) {
					return { ...n, "fontSize": 16 }
				} else {
					return { ...n, "fontSize": 8 }
				}
			})
			dispatch({ type: "SET_GRAPH_DATA", payload: { ...state.graphData, nodes } })
		}
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
			{errorText === "" &&
				Object.keys(state.graphData).length !== 0 && (
					<div className="graph__container">
						<Graph
							id="graph-id"
							data={state.graphData}
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
					</div>
				)}
			{errorText !== "" && <div className="error_text"><p>{errorText}</p></div>}
		</Fragment>
	);
}

export default GraphFunc;
