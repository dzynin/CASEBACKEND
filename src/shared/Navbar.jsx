import React, { useRef, useContext, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import HighlightButton from '../Dashboard/HighlightButton';
import Search from '../Dashboard/Search';
import { Col, Row } from 'reactstrap';

import { UserContext } from "../App";
import { fetchAuth } from '../utils';

const Navbar = ({ setCreateNotes, setShowGraph, showGraph, setShowGraphModal }) => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const toggleButtonRef = useRef(null);

    useEffect(() => {
        setInterval(function () { authChe(); }, 60000);

        if (state && state.auth) {
            const auth = state.auth;
            console.log('Auth Expiry Time', new Date(auth.expiry));
            if (!auth.authToken || !auth.userPublicId || !auth.username || !auth.email) {
                const savedAuth = fetchAuth();
                if (!savedAuth) {
                    history.push("/login");
                } else {
                    dispatch({ type: "AUTH", payload: savedAuth });
                }
            }
        }

        const timer = setTimeout(() => {
            if (toggleButtonRef.current) {
                toggleButtonRef.current.click();
            }
        }, 3000);
        return () => clearTimeout(timer);

    }, [state.auth]);

    const authChe = () => {
        var d = new Date();

        var datestring = d.getDate() + "-" +
            d.getHours() + "-" + d.getMinutes();

        let beforFiveTime = state.auth.expiry - 60000 * 5
        var beforeFiveDateString = new Date(beforFiveTime).getDate() + "-" +
            new Date(beforFiveTime).getHours() + "-" + new Date(beforFiveTime).getMinutes();

        if (beforeFiveDateString === datestring) {
            alert("Auth Signature about to expire in 5 minutes")
        }
        var authExpiry = new Date(state.auth.expiry).getDate() + "-" +
            new Date(state.auth.expiry).getHours() + "-" + new Date(state.auth.expiry).getMinutes();
        if (authExpiry === datestring) {
            history.push("/login");
        }
    }

    const toggleOffcanvas = () => {
        document.querySelector('.sidebar-offcanvas').classList.toggle('active');
    }

    const togglePdfViewer = () => {
        if (state.showFileViewer) {
            dispatch({ type: 'TOGGLE_PDF_VIEWER' });
        }
    }

    return (
        <nav className="navbar p-0 fixed-top d-flex flex-row">
            <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
                <Link className="navbar-brand brand-logo-mini" to="/">
                    <img src={require("../images/logo-mini.svg")} alt="logo" />
                </Link>
            </div>
            <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
                <button
                    ref={toggleButtonRef}
                    className="navbar-toggler align-self-center hamburger"
                    type="button"
                    onClick={() => document.body.classList.toggle("sidebar-icon-only")}
                >
                    <span className="mdi mdi-menu"></span>
                </button>
                <Row
                    style={{ alignItems: "center", width: "100%" }}
                    className="nav_items_upload"
                >
                    <Col lg={3} md={4} xs={12} sm={12}>
                        <Search />
                    </Col>
                    <Col lg={6} md={6} xs={12} sm={12}>
                        {/* <FileUploadComponent /> */}
                    </Col>
                    <Col lg={3} md={2} xs={12} sm={12}>
                        <HighlightButton />
                    </Col>
                </Row>
                <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', margin: '20px auto', width: 'fit-content',gap:'10px' }}>
                    {state.showFileViewer && (
                        <>
                            <div
                                onClick={() => setShowGraph(!showGraph)}
                                className="btn btn-lg btn-secondary text-center cursor-pointer p-2"
                            > {showGraph ? "Hide" : "Graph"}
                            </div>
                            <div
                                onClick={togglePdfViewer}
                                className="btn btn-lg btn-secondary text-center cursor-pointer p-2"
                            > {state.showPdfViewer ? "Show Text Editor" : "Show PDF"}
                            </div>
                        </>
                    )}
                </div>
                <button
                    className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                    type="button"
                    onClick={toggleOffcanvas}
                >
                    <span className="mdi mdi-format-line-spacing"></span>
                </button>
                <button
                    className="btn btn-md bg-danger text-center cursor-pointer p-2 text-white align-self-center log-out-button"
                    type="button"
                    onClick={() => dispatch({ type: "LOG_OUT" })}
                >
                    Log Out
                </button>


            </div>
        </nav>
    );
}

export default Navbar;
