import { updateState, updateHighlightStatus } from '../shared/Utility';
import { InitialState } from './InitialState';

export const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FILE':
            if (!Array.isArray(action.payload)) action.payload = [action.payload];
            let Allfiles = [...state.files, ...action.payload];
            let fileNames = [];
            let files = Allfiles.filter((file) => {
                if (fileNames.includes(file.name)) return false;
                fileNames.push(file.name);
                return true;
            });
            return {
                ...state,
                files,
                currentFile: state.currentFile || action.payload[0],
            };

        case 'AUTH':
            const auth = {
                userId: action.payload.userId,
                authToken: action.payload.auth_token,
                userPublicId: action.payload.userPublicId,
                username: action.payload.username,
                email: action.payload.email,
                expiry: action.payload.expiry || Date.parse(new Date()) + 60 * 60 * 1000,
                fname: action.payload.fname,
                lname: action.payload.lname,
                city: action.payload.city,
                country: action.payload.country,
                organisation: action.payload.organisation,
            };
            localStorage.setItem("authDetails", JSON.stringify(auth));
            return updateState(state, { auth: auth });

        case 'LOG_OUT':
            localStorage.removeItem("authDetails");
            return InitialState;

        case "TOGGLE_HIGHLIGHT":
            return {
                ...state,
                showHighlight: action.payload,
            };

        case 'SET_CURR_FILE':
            return updateState(state, { currentFile: action.payload });

        case 'TOGGLE_VIEWER':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_VIEW':
                return {
                    ...state,
                    showHighlight: false,
                    showFileViewer: false,
                    showDashboardView: false,
                    showProfileView: false,
                    showFeedView: false,
                    showTextAnonymizerView: false,
                    showGptView: false,
                    showLawsReader: false,
                    ...action.payload
                };
    
        case 'ALL_POSTS':
            return updateState(state, { allPosts: action.payload });

        case 'ADD_My_POSTS':
            return updateState(state, { myPosts: [...state.myPosts, action.payload] });

        case 'FETCH_FILE_HIGHLIGHTS':
            return updateState(state, { fileHighlights: action.payload });

        case 'SET_FILE_HIGHLIGHTS':
            let highlights = [];
            if (state.fileHighlights.length > 0) {
                let fileUpdated = false;
                highlights = state.fileHighlights.map((singleFile) => {
                    if (singleFile.name === action.payload.name) {
                        singleFile.highlights = action.payload.highlights;
                        fileUpdated = true;
                    }
                    return singleFile;
                });
                if (!fileUpdated) {
                    highlights = [...state.fileHighlights, action.payload];
                }
            } else {
                highlights = [action.payload];
            }
            return updateState(state, { fileHighlights: highlights });

        case 'ERROR':
            return updateState(state, { error: action.payload });

        case 'MESSAGE':
            return updateState(state, { message: action.payload });

        case 'SET_SEARCH_QUERY':
            return updateState(state, { searchQuery: action.payload });

        case 'SET_NODE_DATA':
            return updateState(state, { nodeData: action.payload });

        case 'SET_GRAPH_DATA':
            return updateState(state, { graphData: action.payload });

        case 'SET_NODES_DATA':
            return updateState(state, { nodesData: action.payload });

        case 'CHANGE_HIGHLIGHT_COLOR': {
            return updateHighlightStatus(state, { ...state.highlightColors, default: action.payload });
        }
        case 'CHANGE_LEGAL_TEST_HIGHLIGHT_COLOR': {
            return updateHighlightStatus(state, { ...state.highlightColors, legalTest: action.payload });
        }
        case 'CHANGE_ISSUE_HIGHLIGHT_COLOR': {
            return updateHighlightStatus(state, { ...state.highlightColors, issue: action.payload })
        }
        case 'CHANGE_CONCLUSION_HIGHLIGHT_COLOR': {
            return updateHighlightStatus(state, { ...state.highlightColors, conclusion: action.payload })
        }
        case 'SET_MODAL':
            return updateState(state, { isModalOpen: action.payload });

        case 'SET_HIGHLIGHT_TEXT':
            return {
                ...state,
                highlightTextForEditor: action.payload,
            };

        case 'ADD_HIGHLIGHT_TEXT':
            const newHighlight = action.payload;
            const updatedHighlights = [...(state.highlightTextsForEditor || []), newHighlight]; // Fallback to empty array if not defined
            return {
                ...state,
                highlightTextsForEditor: updatedHighlights,
            };
            
        case 'SET_ACCORDION_SECTIONS':
                return updateState(state, { accordionSections: action.payload });
                // return { ...state, accordionSections: [{ test: 'data' }] };  // Test static data

        case 'TOGGLE_PDF_VIEWER':
            return {
                ...state,
                showPdfViewer: !state.showPdfViewer,
            };

        case 'SHOW_METADATA_VIEWER':
            return {
                ...state,
                showMetadataViewer: true,
            };

        case 'HIDE_METADATA_VIEWER':
            return {
                ...state,
                showMetadataViewer: false,
            };        

        case 'SHOW_PDF_VIEWER':
                return {
                    ...state,
                    showPdfViewer: true,
                };
    
        case 'SHOW_TEXT_EDITOR':
                return {
                    ...state,
                    showPdfViewer: false,
                };
    


        default:
            return state;
    }
};
