import React, { useContext, useState, useCallback, Fragment } from "react";
import axios from "axios";
import { Button, Table } from "reactstrap";
import { useDropzone } from 'react-dropzone';
import { IoArrowBackCircle } from "react-icons/io5";
import folderDocs from '../images/cloud-drag.png';
import { UserContext } from "../App";
import { BASE_URL_DEV } from "../utils";
import FileMetadataViewer from './FileMetadataViewer';
import TriggerFileViewer from './TriggerFileViewer';

const async = require('async');

function MultiFileUpload({ onBackClick ,caseName}) {
    const { state, dispatch } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles([...files, ...acceptedFiles]);
    }, [files]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSelectFile = (fileName) => {
        setSelectedFiles(prevSelected =>
            prevSelected.includes(fileName)
                ? prevSelected.filter(name => name !== fileName)
                : [...prevSelected, fileName]
        );
    };

    const handleSelectAll = () => {
        setSelectedFiles(selectedFiles.length === files.length ? [] : files.map(file => file.name));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const filesToUpload = files.filter(file => selectedFiles.includes(file.name));
        if (filesToUpload.length === 0) return;

        const data = new FormData();
        filesToUpload.forEach(file => data.append('files', file));
        data.append('case_name', caseName);  // Add case name to the FormData
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL_DEV}/upload/multiple-files`, data, {
                headers: {
                    'x-access-token': state.auth && state.auth.authToken,
                }
            });
            // console.log("Upload response:", response.data);
            setUploadedFiles(response.data.files);
            setFiles([]);
            setSelectedFiles([]);
            setIsLoading(false);
            dispatch({ type: 'SHOW_METADATA_VIEWER' });

            // Fetch highlights and set current file
            async.eachSeries(response.data.files, function (uploadedFile, cbBatch) {
                axios.get(`${BASE_URL_DEV}/highlights-json/${state.auth.userPublicId}/${uploadedFile.name}`, {
                    headers: {
                        'x-access-token': state.auth && state.auth.authToken,
                    }
                }).then(function (result) {
                    const fileHighlights = result.data;
                    if (fileHighlights && fileHighlights.highlights) {
                        dispatch({ type: "SET_FILE_HIGHLIGHTS", payload: fileHighlights.highlights });
                        console.log("Setting Accordion Sections:", fileHighlights.highlights );

                        console.log("Setting Accordion Sections:", fileHighlights.highlights.sections || []);
                        dispatch({ type: "SET_ACCORDION_SECTIONS", payload: fileHighlights.highlights.sections || [] });

                    }
                    cbBatch(null);
                }).catch(error => {
                    console.error("Error fetching highlights:", error);
                    cbBatch(error);
                });
            }, async (loopErrBatch) => {
                if (!loopErrBatch) {
                    try {
                        const result = await axios(`${BASE_URL_DEV}/get/files`, {
                            headers: {
                                "x-access-token": state.auth && state.auth.authToken,
                            },
                        });
                        const files = result.data && result.data.files;
                        // console.log("Fetched files response:", files);
                        if (result && files && files.length > 0) {
                            const results = await axios(`${BASE_URL_DEV}/get-graphdata`, {
                                headers: {
                                    "x-access-token": state.auth && state.auth.authToken,
                                },
                            });
                            const allgraphs = results.data;
                            // console.log("Graph data response:", allgraphs);
                            let Obj = {};
                            results && allgraphs && allgraphs.graphdata && allgraphs.graphdata.length > 0 && allgraphs.graphdata.filter(x => {
                                Obj[x.fileName] = x.links.filter(e => e.source === "CITATION" || e.source === "PROVISION");
                            });
                            const fileNew = files.map(element => ({
                                ...element,
                                CITATION: Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source === "CITATION") : ["N/A"],
                                PROVISION: Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source === "PROVISION") : ["N/A"]
                            }));
                            // console.log("New files with citation and provision:", fileNew);
                            dispatch({ type: "ADD_FILE", payload: fileNew });
                            dispatch({ type: "SET_MODAL", payload: true });

                            // Set the first uploaded file as the current file
                            if (fileNew.length > 0) {
                                const firstUploadedFile = filesToUpload[0];
                                const firstFileResponse = response.data.files[0];
                                const fileToSet = new File([firstUploadedFile], firstFileResponse.name, {
                                    type: firstUploadedFile.type,
                                    lastModified: firstUploadedFile.lastModified
                                });
                                dispatch({ type: "SET_CURR_FILE", payload: fileToSet });
                                // console.log("New SET_CURR_FILE:", fileToSet);
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching files and graph data:", error);
                    }
                } else {
                    console.error("Error in loopErrBatch:", loopErrBatch);
                }
            });
            // dispatch({ type: "SET_VIEW", payload: { showFileViewer: true } });
        } catch (error) {
            console.error("Upload error:", error);
            dispatch({ type: "ERROR", payload: error.response?.statusText || 'File Upload Failed!!' });
            setIsLoading(false);
        }
    };

    const handleViewPDF = async (file) => {
        try {
            // console.log("Fetching PDF for file:", file);
            const response = await axios.get(`${BASE_URL_DEV}/uploads/${state.auth.userPublicId}/${file.name}`, {
                responseType: 'blob',
                headers: {
                    'x-access-token': state.auth && state.auth.authToken,
                }
            });
            const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
            const fileToSet = new File([fileBlob], file.name, {
                type: fileBlob.type,
                lastModified: file.lastModified || new Date().getTime()
            });
            // console.log("Setting current file:", fileToSet);
            // dispatch({ type: 'SET_CURR_FILE', payload: fileToSet });

            async.eachSeries([file], function (element, cbBatch) {
                axios.get(`${BASE_URL_DEV}/highlights-json/${state.auth.userPublicId}/${element.name}`, {
                    headers: {
                        'x-access-token': state.auth && state.auth.authToken,
                    }
                }).then(function (result) {
                    const fileHighlights = result.data;
                    // console.log("File highlights received:", fileHighlights);
                    if (fileHighlights && fileHighlights.highlights) {
                        dispatch({
                            type: "SET_FILE_HIGHLIGHTS",
                            payload: fileHighlights.highlights,
                        });
                        // console.log("Setting Accordion Sections:", fileHighlights.highlights.sections || []);
                        // dispatch({ type: "SET_ACCORDION_SECTIONS", payload: fileHighlights.sections || [] });
                            
                    }
                    cbBatch(null);
                }).catch(error => {
                    console.error("Error fetching highlights:", error);
                    cbBatch(error);
                });
            }, (loopErrBatch) => {
                if (!loopErrBatch) {
                    (async () => {
                        try {
                            const result = await axios(`${BASE_URL_DEV}/get/files`, {
                                headers: {
                                    "x-access-token": state.auth && state.auth.authToken,
                                },
                            });
                            const files = result.data && result.data.files;
                            // console.log("Fetched files response:", files);
                            if (result && files && files.length > 0) {
                                const results = await axios(`${BASE_URL_DEV}/get-graphdata`, {
                                    headers: {
                                        "x-access-token": state.auth && state.auth.authToken,
                                    },
                                });
                                const allgraphs = results.data;
                                // console.log("Graph data response:", allgraphs);
                                let Obj = {};
                                results && allgraphs && allgraphs.graphdata && allgraphs.graphdata.length > 0 && allgraphs.graphdata.filter(x => {
                                    Obj[x.fileName] = x.links.filter(e => e.source === "CITATION" || e.source === "PROVISION");
                                });
                                const fileNew = files.map(element => ({
                                    ...element,
                                    CITATION: Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source === "CITATION") : ["N/A"],
                                    PROVISION: Obj[element.name] && Obj[element.name].length > 0 ? Obj[element.name].filter(e => e.source === "PROVISION") : ["N/A"]
                                }));
                                // console.log("New files with citation and provision:", fileNew);
                                dispatch({ type: "ADD_FILE", payload: fileNew });
                                dispatch({ type: "SET_MODAL", payload: true });
                                // Trigger the file viewer
                                dispatch({ type: "SET_VIEW", payload: { showFileViewer: true } });
                            }
                        } catch (error) {
                            console.error("Error fetching files and graph data:", error);
                        }
                    })();
                } else {
                    console.error("Error in loopErrBatch:", loopErrBatch);
                }
            });
            dispatch({ type: "SET_VIEW", payload: { showFileViewer: true } });
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };

    return (
        <Fragment>
            <div className="previewComponent">
                <button className="back-button" onClick={onBackClick}>
                    <IoArrowBackCircle size={40} />
                </button>
                {!state.showMetadataViewer && files.length === 0 && (
                    <div {...getRootProps()} className="drag-drop__area">
                        <input {...getInputProps()} />
                        <div className="drag-drop__file-icon">
                            <img src={folderDocs} alt="Dropping File ..." className="drag-drop-image" />
                            <h5 className="drag-drop-text">Drag & Drop case files here<button className="browse-button"></button></h5>
                        </div>
                    </div>
                )}
                {!state.showMetadataViewer && files.length > 0 && (
                    <Fragment>
                        <div className="file-preview">
                            <Table responsive bordered className="custom-table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.length === files.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>File Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file, index) => (
                                        <tr key={index} onClick={() => handleSelectFile(file.name)} style={{ cursor: 'pointer' }}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.includes(file.name)}
                                                    onChange={(e) => { e.stopPropagation(); handleSelectFile(file.name); }}
                                                />
                                            </td>
                                            <td>{file.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="upload-button-container">
                            <Button
                                className="btn btn-lg submitButton"
                                color="success"
                                onClick={handleUpload}
                                disabled={selectedFiles.length === 0 || isLoading}
                            >
                                Upload
                            </Button>
                        </div>
                    </Fragment>
                )}
                {state.showMetadataViewer && <FileMetadataViewer files={uploadedFiles} onFileClick={handleViewPDF} />}
                {isLoading && <div className="loading"></div>}
                {/* <TriggerFileViewer onBackClick={onBackClick} /> */}
            </div>
        </Fragment>
    );
}

export default MultiFileUpload;
