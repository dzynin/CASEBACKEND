// PdfGraphFunc.js
import React, { useEffect, useState, useContext, useRef } from "react";
import { Graph } from "react-d3-graph";
import axios from "axios";
import { Fragment } from "react";
import { UserContext } from "../App";
import { BASE_URL_DEV } from "../utils";
import { useSocket } from '../shared/SocketContext'; // Use the context
import GraphIframeView from './GraphIframeView';

function PdfGraphFunc(props) {
    const [obj, setObj] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const errorText = "";
    const socket = useSocket();
    const [iframeUrl, setIframeUrl] = useState(null);

    useEffect(() => {
        if (state.graphData.length !== 0) {
            (async () => {
                const result = await axios(`${BASE_URL_DEV}/get-graphdata`, {
                    headers: {
                        "x-access-token": state.auth && state.auth.authToken,
                    },
                });
                const allgraphs = result.data;

                let currentFileName = state.currentFile && state.currentFile.name ? state.currentFile.name : '';
                allgraphs && allgraphs.graphdata && allgraphs.graphdata.length && allgraphs.graphdata.filter(x => {
                    if (x.fileName == currentFileName) {
                        delete x.fileName
                        setObj(x);
                        return x;
                    }
                });

                if (allgraphs && allgraphs.length > 0) {
                    dispatch({
                        type: "FETCH_FILE_HIGHLIGHTS",
                        payload: allgraphs.highlights,
                    });
                }
            })();
        }

        if (socket) {
            socket.on('new-graph-nodes-reciever', (data) => {
                console.log('Received new Graph data:', data);
                setObj(data);
            });

            return () => {
                socket.off('new-graph-nodes-reciever');
            };
        }
    }, [state, socket]);

    const myConfig = {
        automaticRearrangeAfterDropNode: true,
        collapsible: false,
        directed: false,
        focusAnimationDuration: 10,
        focusZoom: 1,
        freezeAllDragEvents: false,
        height: 710,
        highlightDegree: 0.1,
        highlightOpacity: 1,
        linkHighlightBehavior: true,
        maxZoom: 8,
        minZoom: 0.1,
        nodeHighlightBehavior: true,
        panAndZoom: false,
        staticGraph: false,
        staticGraphWithDragAndDrop: false,
        width: 50,
        d3: {
            alphaTarget: 0.05,
            gravity: -150,
            linkLength: 90,
            linkStrength: 2,
            disableLinkForce: false,
        },
        node: {
            color: "#d3d3d3",
            fontColor: "#d3d3d3",
            fontSize: 12,
            fontWeight: "normal",
            highlightColor: "lightgreen",
            highlightFontSize: 17,
            highlightFontWeight: "Bold",
            highlightStrokeColor: "SAME",
            highlightStrokeWidth: "SAME",
            labelProperty: "id",
            mouseCursor: "pointer",
            opacity: 1,
            renderLabel: true,
            size: 200,
            strokeColor: "none",
            strokeWidth: 1.5,
            svg: "",
            symbolType: "circle",
        },
        link: {
            color: "#d3d3d3",
            fontColor: "black",
            fontSize: 8,
            fontWeight: "normal",
            highlightColor: "SAME",
            highlightFontSize: 8,
            highlightFontWeight: "normal",
            labelProperty: "label",
            mouseCursor: "pointer",
            opacity: 1,
            renderLabel: false,
            semanticStrokeWidth: false,
            strokeWidth: 1.5,
            markerHeight: 6,
            markerWidth: 6,
            strokeDasharray: 0,
            strokeDashoffset: 0,
            strokeLinecap: "butt",
        },
    };

    const onClickGraph = function (event) {
        //  window.alert('Clicked the graph background');
    };
    /* standard */

    // const onClickNode = function (nodeId, node) {
    //     window.alert(`Clicked node ${nodeId} in position (${node.x}, ${node.y})`);
    // };
    
    /* iframe attempt */

    // const onClickNode = async (nodeId) => {
    //     try {
    //         const response = await axios.post(`${BASE_URL_DEV}/get-node-url`, { nodeId }, {
    //             headers: {
    //                 "x-access-token": state.auth && state.auth.authToken,
    //             },
    //         });

    //         if (response.data && response.data.url) {
    //             setIframeUrl(response.data.url);
    //         } else {
    //             setIframeUrl(null);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching node URL:', error);
    //         setIframeUrl(null);
    //     }
    // };

    /* open link outside */

    const onClickNode = async (nodeId) => {
        try {
            const response = await axios.post(`${BASE_URL_DEV}/get-node-url`, { nodeId }, {
                headers: {
                    "x-access-token": state.auth && state.auth.authToken,
                },
            });

            if (response.data && response.data.url) {
                window.open(response.data.url, "_blank");
            } else {
                console.error('No URL found for the given Node ID');
            }
        } catch (error) {
            console.error('Error fetching node URL:', error);
        }
    };


    const onDoubleClickNode = function (nodeId, node) {
        const nodeData = state.nodesData[nodeId];
        if (nodeData) {
            window.open(nodeData["frontend_url"], "_blank");
        }
    };

    const onRightClickNode = function (event, nodeId, node) {
        //  window.alert('Right clicked node ${nodeId} in position (${node.x}, ${node.y})');
    };

    const onMouseOverNode = function (nodeId, node) {
        const nodeData = state.nodesData[node.id];
        if (nodeData) {
            dispatch({ type: "SET_NODE_DATA", payload: nodeData });
            let nodes = state.graphData.nodes.map((n) => {
                if (n.id === node.id) {
                    return { ...n, fontSize: 16 };
                } else {
                    return { ...n, fontSize: 8 };
                }
            });
            dispatch({
                type: "SET_GRAPH_DATA",
                payload: { ...state.graphData, nodes },
            });
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
            {errorText === "" && !Array.isArray(obj) && (
                <div className="graph__container">
                    {obj && (
                        <Graph
                            id="graph-id"
                            data={obj}
                            key={Math.round((new Date()).getTime() + Math.random())}
                            config={myConfig}
                            onClickGraph={onClickGraph}
                            onClickNode={onClickNode}
                            passive={true}
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
                </div>
            )}
            {errorText !== "" && (
                <div className="error_text">
                    <p>{errorText}</p>
                </div>
            )}

        {/* {iframeUrl && <GraphIframeView url={iframeUrl} />} */}

        </Fragment>
    );
}

export default PdfGraphFunc;
