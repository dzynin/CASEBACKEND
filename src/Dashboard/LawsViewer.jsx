import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AccordionGenerator from '../Dashboard/Accordion';
import folder from '../images/folder.png';
import folderDocs from '../images/folder_documents.png';

const LawsViewer = () => {
	const [data, setData] = useState([]);
	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				const binaryStr = reader.result;
				const jsonFile = JSON.parse(binaryStr);
				setData(jsonFile.sections || []);
			};
			reader.readAsText(file);
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="dashboard-view bg-dark p-5" style={{ width: "100%" }}>
			<div className="drag-drop">
				<div {...getRootProps()} className="drag-drop__area">
					<input {...getInputProps()} />
					{isDragActive ? (
						<>
							<div className="drag-drop__file-icon">
								<div>
									<img src={folderDocs} alt="Dropping File ..." className="images" />
								</div>
								<div>
									<h2>Drag and drop or<button className="browse-button"><u>browse</u></button></h2>
								</div>
							</div>
							{data.length > 0 && (
								<div className="side-drag-drop">
									<h2>
										Drag and drop
										<button className="browse-button">
											<u>browse</u>
										</button>
									</h2>
								</div>
							)}
						</>
					) : (
						<>
							<div className="drag-drop__file-icon">
								<div>
									<img src={folder} alt="Drop File here " className="images" />
								</div>
								<div>
									<h2>Drag and drop or<button className="browse-button"><u>browse</u></button></h2>
								</div>
							</div>
							{data.length > 0 && (
								<div className="side-drag-drop">
									<h2>
										Drag and drop or
										<button className="browse-button">
											<u>browse</u>
										</button>
									</h2>
								</div>
							)}
						</>
					)}
				</div>
			</div>
			<div>
				{data.length > 0 && <AccordionGenerator data={data} />}
			</div>
		</div>
	);
};

export default LawsViewer;
