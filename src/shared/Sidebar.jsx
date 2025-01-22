// src/shared/Sidebar.js

import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { Trans } from "react-i18next";
import TextEditor from "../TextEditor";
import { UserContext } from "../App";
import { BASE_URL_DEV } from "../utils";
import SideNav from "./SideNav";
import Profile from "./Profile";

export const useSidebarLogic = () => {
    const { state, dispatch } = useContext(UserContext);

    const fetchFilesAndGraphData = async () => {
        if (!state.auth || !state.auth.authToken) return;
        const result = await axios(`${BASE_URL_DEV}/get/files`, {
            headers: {
                "x-access-token": state.auth && state.auth.authToken,
            },
        });
        const files = result.data && result.data.files;
        if (files && files.length > 0) {
            const results = await axios(`${BASE_URL_DEV}/get-graphdata`, {
                headers: {
                    "x-access-token": state.auth && state.auth.authToken,
                },
            });
            const allgraphs = results.data;
            let Obj = {};
            let _id = "";

            allgraphs && allgraphs.graphdata && allgraphs.graphdata.length && allgraphs.graphdata.filter(x => {
                _id = x.fileName;
                Obj[_id] = x.links.filter(e => e.source == "CITATION" || e.source == "PROVISION");
            });
            const fileNew = files.map(element => ({
                ...element,
                CITATION: Obj && Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source == "CITATION") : ["N/A"],
                PROVISION: Obj && Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source == "PROVISION") : ["N/A"],
            }));
            dispatch({ type: "ADD_FILE", payload: fileNew });
        }
    };

    const fetchHighlights = async () => {
        if (state.fileHighlights && state.fileHighlights.length === 0) {
            const result = await axios(`${BASE_URL_DEV}/get-highlights`, {
                headers: {
                    "x-access-token": state.auth && state.auth.authToken,
                },
            });
            const fileHighlights = result.data;
            if (!state.currentFile && fileHighlights && fileHighlights.highlights && fileHighlights.highlights.length) {
                const data = {
                    name: fileHighlights.highlights[0]["name"],
                    url: `uploads/${state.auth.userPublicId}/${fileHighlights.highlights[0]["name"]}`
                };
                dispatch({ type: "SET_CURR_FILE", payload: data });
            }
            if (fileHighlights && fileHighlights.highlights && fileHighlights.highlights.length > 0) {
                dispatch({
                    type: "FETCH_FILE_HIGHLIGHTS",
                    payload: fileHighlights.highlights,
                });
            }
        }
    };

    const showFileViewerHandler = () => {
        dispatch({ type: "SET_VIEW", payload: { showFileViewer: true } });
    }

    return {
        fetchFilesAndGraphData,
        fetchHighlights,
        showFileViewerHandler,
    };
}

function Sidebar() {
    const { state, dispatch } = useContext(UserContext);
    const { fetchFilesAndGraphData, fetchHighlights } = useSidebarLogic();

    useEffect(() => {
        fetchFilesAndGraphData();
        fetchHighlights();
    }, [state.auth.authToken]);

    const itemClickHandler = (viewState) => {
        dispatch({ type: "SET_VIEW", payload: viewState });
    }

    const [showTextEditor, setShowTextEditor] = useState(false);

    const handleTextEditor = (e) => {
        e.preventDefault();
        setShowTextEditor(true);
    };

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
                <a className="sidebar-brand brand-logo" href="index.html">
                    <img src={require("../images/scaletransm2.png")} alt="logo" />
                </a>
                <a className="sidebar-brand brand-logo-mini" href="index.html">
                    <img src={require("../images/scaletransm2.png")} alt="logo" />
                </a>
            </div>
            <ul className="nav">
                <Profile profileClick={() => itemClickHandler({ showProfileView: true })}
                    authUser={state.auth && state.auth.username}
                    authEmail={state.auth && state.auth.email} />

                <li className="nav-item nav-category">
                    <span className="nav-link">
                    </span>
                </li>
                <SideNav class={state.showDashboardView} click={() => itemClickHandler({ showDashboardView: true })}
                    iconClass='mdi mdi-speedometer' transTitle='Dashboard' />

                <SideNav class={state.showFileViewer} click={() => itemClickHandler({ showFileViewer: true })}
                    iconClass='mdi mdi-file' transTitle='Copilot' />

                <SideNav class={false} click={handleTextEditor}
                    iconClass='mdi mdi-text' transTitle='Notes' />

                <SideNav class={state.showTextAnonymizerView} click={() => itemClickHandler({ showTextAnonymizerView: true })}
                    iconClass='mdi mdi-text' transTitle='Anonymizer' />

                {/* <SideNav class={state.showLawsReader} click={() => itemClickHandler({ showLawsReader: true })}
                    iconClass='mdi mdi-scale-balance' transTitle='Easy-Reader' /> */}

            </ul>
            {showTextEditor && (
                <TextEditor
                    id={state.auth && state.auth.userPublicId}
                    fileName={'index'}
                    showTextEditor={showTextEditor}
                    setShowTextEditor={setShowTextEditor}
                />
            )}
        </nav>
    );
}

export default Sidebar;
