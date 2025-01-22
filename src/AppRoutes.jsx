import React, { Suspense, lazy } from "react";
import Spinner from "./shared/Spinner";
import Highlight from "./shared/Highlight";
const Dashboard = lazy(() => import("./Dashboard/Index"));
const PdfViewer = lazy(() => import("./Dashboard/PdfViewer"));
const DocumentViewer = lazy(() => import("./Dashboard/DocumentViewer"));  // Import here

function AppRoutes(props) {
    return (
        <Suspense fallback={<Spinner />}>
            {props.showHighlight && <Highlight />}
            {props.showFileViewer && <PdfViewer />}
            {props.showDocViewer && <DocumentViewer />}
            <Dashboard
                showFileViewer={props.showFileViewer}
                showDashboardView={props.showDashboardView}
                showHighlight={props.showHighlight}
                showProfileView={props.showProfileView}
                showFeedView={props.showFeedView}
                showTextAnonymizerView={props.showTextAnonymizerView}
                showGptView={props.showGptView}
                showDocViewer={props.showDocViewer}
            />
        </Suspense>
    );
}

export default AppRoutes;
