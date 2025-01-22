import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import { UserContext } from '../App';
import { BASE_URL_DEV } from '../utils';
import axios from 'axios';

const TriggerFileViewer = ({ onBackClick }) => {
    const { state, dispatch } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleTriggerFileViewer = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL_DEV}/get/files`, {
                headers: {
                    'x-access-token': state.auth && state.auth.authToken,
                }
            });

            const files = response.data && response.data.files;
            if (files && files.length > 0) {
                dispatch({ type: 'ADD_FILE', payload: files });

                const fileHighlightsResponse = await axios.get(`${BASE_URL_DEV}/get-highlights`, {
                    headers: {
                        'x-access-token': state.auth && state.auth.authToken,
                    }
                });

                const fileHighlights = fileHighlightsResponse.data;
                if (fileHighlights && fileHighlights.highlights && fileHighlights.highlights.length > 0) {
                    dispatch({ type: 'FETCH_FILE_HIGHLIGHTS', payload: fileHighlights.highlights });

                    const firstFile = fileHighlights.highlights[0];
                    const data = {
                        name: firstFile.name,
                        url: `uploads/${state.auth.userPublicId}/${firstFile.name}`
                    };
                    dispatch({ type: 'SET_CURR_FILE', payload: data });
                }
            }
            dispatch({ type: "SET_VIEW", payload: { showFileViewer: true } });
        } catch (error) {
            console.error('Error triggering file viewer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="trigger-file-viewer-component">
            <Button
                className="btn btn-lg triggerButton"
                color="primary"
                onClick={handleTriggerFileViewer}
                disabled={isLoading}
            >
                Trigger File Viewer
            </Button>
            {isLoading && <div className="loading"></div>}
            <button className="back-button" onClick={onBackClick}>
                {/* <IoArrowBackCircle size={40} /> */}
            </button>
        </div>
    );
};

export default TriggerFileViewer;
