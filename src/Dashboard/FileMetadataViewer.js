//src/Dashboard/FileMetadataViewer
import React from 'react';
import { Table, Button } from 'reactstrap';

function FileMetadataViewer({ files, onFileClick }) {
    return (
        <div className="file-metadata-viewer">
            <h2>Files</h2>
            <Table responsive bordered className="custom-table">
                <thead>
                    <tr>
                        <th>File Name</th>
                        {/* <th>File Size</th> */}
                        <th>Upload Date</th>
                        {/* <th>Category</th> */}
                        <th>Summary</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={index}>
                            <td>{file.name}</td>
                            {/* <td>{(file.size / 1024).toFixed(2)} KB</td> */}
                            <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                            {/* <td>{file.category}</td> */}
                            <td>{file.summary}</td>
                            <td>
                                <Button color="primary" onClick={() => onFileClick(file)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default FileMetadataViewer;
