import React, { useState, useReducer, createContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./AppRoutes";
import { reducer } from "./Reducer/Reducers";
import { InitialState } from "./Reducer/InitialState";
import { Route, Redirect, Switch, BrowserRouter as Router } from "react-router-dom";
import NodePreview from "./Dashboard/NodePreview";
import NodesList from "./Dashboard/NodesList";
import Register from "./Dashboard/Register";
import Login from "./Dashboard/Login";
import Sidebar from "./shared/Sidebar";
import "./App.scss";
import "./style/App.css";
import Navbar from "./shared/Navbar";
import FileViewer from "./Dashboard/FileViewer";
import FileMetadataViewer from "./Dashboard/FileMetadataViewer";
import PdfViewerSide from "./Dashboard/PdfViewerSide";
import { SocketProvider } from './shared/SocketContext';

export const UserContext = createContext();

function App() {
    const [state, dispatch] = useReducer(reducer, InitialState);

    const [createNotes, setCreateNotes] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [showGraphModal, setShowGraphModal] = useState(false);

    useEffect(() => {
        return () => {
            dispatch({ type: 'HIDE_METADATA_VIEWER' });
        };
    }, []);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <SocketProvider>
                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route exact path="/dashboard">
                            <div className="container-scroller">
                                <Sidebar />
                                <div className="container-fluid page-body-wrapper">
                                    <Navbar 
                                        setCreateNotes={setCreateNotes}
                                        setShowGraph={setShowGraph}
                                        showGraph={showGraph}
                                        setShowGraphModal={setShowGraphModal}
                                    />
                                    <div className="main-panel">
                                        <div className="show_side" style={{ display: "flex" }}>
                                            {state.showHighlight === true && state.searchQuery !== "" && <NodesList />}
                                            {state.showFileViewer === true && <FileViewer />}
                                            <div className="content-wrapper">
                                                <AppRoutes
                                                    showFileViewer={state.showFileViewer}
                                                    showDashboardView={state.showDashboardView}
                                                    showHighlight={state.showHighlight}
                                                    showProfileView={state.showProfileView}
                                                    showFeedView={state.showFeedView}
                                                    showTextAnonymizerView={state.showTextAnonymizerView}
                                                    showLawsReader={state.showLawsReader}
                                                    showGptView={state.showGptView}
                                                />
                                                {state.showDashboardView && state.showMetadataViewer && (
                                                    <FileMetadataViewer files={state.files} />
                                                )}
                                            </div>
                                            {state.showHighlight === true && state.searchQuery !== "" && <NodePreview />}
                                            {state.showFileViewer && (
                                                <PdfViewerSide
                                                    createNotes={createNotes}
                                                    showGraph={showGraph}
                                                    showGraphModal={showGraphModal}
                                                    setShowGraphModal={setShowGraphModal}
                                                    setCreateNotes={setCreateNotes}
                                                    setShowGraph={setShowGraph}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Route>
                        <Redirect to="/login" />
                    </Switch>
                </Router>
            </SocketProvider>
        </UserContext.Provider>
    );
}

export default App;
