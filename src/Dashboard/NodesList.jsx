import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";

function Highlight(props) {
	const { state, dispatch } = useContext(UserContext);
	const [graphData, setGraphData] = useState({})

	useEffect(() => {
		setTimeout(() => setGraphData(state.graphData), 500)
	}, [state.graphData]);

	function handleMouseEnter(node) {
		const nodeData = state.nodesData[node.id]
		if (nodeData) {
			let nodes = state.graphData.nodes.map(n => {
				if (n.id === node.id) {
					return { ...n, "fontSize": 16 }
				} else {
					return { ...n, "fontSize": 8 }
				}
			})
			dispatch({ type: "SET_GRAPH_DATA", payload: { ...state.graphData, nodes } })
		}
		if (nodeData) {
			dispatch({ type: "SET_NODE_DATA", payload: nodeData })
		}
	}

	function handleMouseLeave(node) {
		const nodeData = state.nodesData[node.id]
		if (nodeData) {
			let nodes = state.graphData.nodes.map(n => {
				return { ...n, "fontSize": 8 }
			})

			dispatch({ type: "SET_GRAPH_DATA", payload: { ...state.graphData, nodes } })
		}
	}

	return (
		<div className="sidebarnew2" style={{ width: "25vw" }}>
			<ul className="sidebar__highlights" style={{ "maxHeight": "96vh", "overflow": "scroll" }}>
				{graphData.nodes && graphData.nodes.map((node, index) => (
					node.id !== state.searchQuery && state.nodesData[node.id] !== undefined ?
						<li
							onMouseEnter={() => handleMouseEnter(node)}
							onMouseLeave={() => handleMouseLeave(node)}
							key={index}
							className="sidebar__highlight"
						>
							<div>
								<p style={{ "opacity": ".5" }}>{state.nodesData[node.id] ? state.nodesData[node.id].docket_number : null}</p>
								<p>{state.nodesData[node.id] ? state.nodesData[node.id].name : node.id}</p>
							</div>
						</li> : null
				))}
			</ul>
		</div>
	);
}

export default Highlight;
