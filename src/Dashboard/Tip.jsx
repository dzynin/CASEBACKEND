// @flow

import React, { useState } from "react";
import processMd from './markdown'
import "../style/Tip.css";

function Tip(props) {
	const [state, setState] = useState({
		compact: true,
		text: '',
		emoji: '',
	});

	const { onConfirm, onOpen } = props;
	const { compact, text, emoji } = state;

	return (
		<div className="Tip">
			{compact ? (
				<div
					className="Tip__compact"
					onClick={() => {
						onOpen();
						setState({ compact: false });
					}}
				>
					Add highlight
				</div>
			) : (
				<form
					className="Tip__card"
					onSubmit={event => {
						event.preventDefault();
						onConfirm({ text, emoji });
					}}
				>
					<div>
						<textarea
							width="100%"
							placeholder="Your comments"
							autoFocus
							value={text}
							onChange={event => setState({ text: event.target.value })}
							ref={node => {
								if (node) {
									node.focus();
								}
							}}
						/>
					</div>
					<div
						id="preview"
						width='100%'
					>
						{
							processMd(state.text)
						}
					</div>
					<div>
						<input type="submit" value="Save" />
					</div>
				</form>
			)}
		</div>
	);
}

export default Tip;
