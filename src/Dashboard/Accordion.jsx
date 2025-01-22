import React, { useContext, useState, useRef, useEffect } from 'react';
import Card from 'react-bootstrap';
import Accordion from 'react-bootstrap';
import AccordionContext from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap';

function AccordionGenerator(props) {
	const [searchInput, setSearchInput] = useState('');
	const [activeKeys, setActiveKeys] = useState([]);
	const [active, setActive] = useState('');
	const [count, setCount] = useState(0);
	const myRef = useRef();

	useEffect(() => {
		let accordionContainer = myRef.current;
		let selectAccordion = accordionContainer.querySelectorAll('.accordion');
		let currIndex = activeKeys[count];
		if (selectAccordion[currIndex]) {
			accordionContainer.scrollTo({ behavior: 'smooth', top: selectAccordion[currIndex].offsetTop });
		}
	}, [count]);

	function ContextAwareToggle({ children, eventKey, callback }) {
		const currentEventKey = useContext(AccordionContext);

		const decoratedOnClick = useAccordionToggle(
			eventKey,
			() => callback && callback(eventKey),
		);
		const isCurrentEventKey = currentEventKey === eventKey;

		return (
			<div className="accordion-card__header-items">
				<div className="accordion-card__active-tab">
					{
						isCurrentEventKey ?
							<span className="online"><i className="mdi mdi-checkbox-blank-circle"></i></span> :
							<span className="offline"><i className="mdi mdi-checkbox-blank-circle"></i></span>
					}
				</div>
				<button
					type="button"
					className={'header-button'}
					onClick={decoratedOnClick}
				>
					{children}
				</button>
				<div className="accordion-card__active-tab">
					{
						isCurrentEventKey ?
							<i className="mdi mdi-chevron-up"></i> :
							<i className="mdi mdi-chevron-down"></i>
					}
				</div>
			</div>
		);
	}

	const scroller = (activeKeys) => {
		let accordionContainer = myRef.current;
		let selectAccordion = accordionContainer.querySelectorAll('.accordion');
		let currIndex = activeKeys[count];
		if (selectAccordion[currIndex]) {
			accordionContainer.scrollTo({ behavior: 'smooth', top: selectAccordion[currIndex].offsetTop });
		}
	}

	const searchHandler = (event) => {
		let matchedTextIndexArray = [];
		props.data.forEach((d, index) => {
			if (d.text.toLowerCase().includes(searchInput.toLowerCase())) {
				matchedTextIndexArray.push(index);
			}
		});
		setActiveKeys(matchedTextIndexArray);
		scroller(matchedTextIndexArray);
		event.preventDefault();
	}

	const accordionClickHandler = (e, keyIndex) => {
		let newActiveKeys = [...activeKeys];
		if (activeKeys.includes(keyIndex)) {
			let index = activeKeys.indexOf(keyIndex);
			newActiveKeys.splice(index, 1);
			setActiveKeys(newActiveKeys);
		}
		else {
			setActive(e === 0 ? '0' : e);
		}
	}

	const prevClickHandler = () => {
		if (count < 0) {
			return;
		}
		setCount(c => c - 1);
	}

	const nextClickHandler = () => {
		if (count > activeKeys.length - 1) {
			return;
		}
		setCount(c => c + 1);
	}

	return (
		<div>
			<div className="accordion-container" ref={myRef}>
				{Array.isArray(props.data) && props.data.map((d, index) => (
					<Accordion key={index} activeKey={activeKeys.includes(index) ? (index === 0 ? '0' : index) : (active === 0 ? '0' : active)} onSelect={(e) => accordionClickHandler(e, index === 0 ? '0' : index)}>
						<Card className="accordion-card">
							<Card.Header className="accordion-card__header">
								<ContextAwareToggle eventKey={index === 0 ? '0' : index}>{d.clause}</ContextAwareToggle>
							</Card.Header>
							<Accordion.Collapse eventKey={index === 0 ? '0' : index}>
								<Card.Body className="accordion-card__body">{d.text}</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
				))}
			</div>
			<form className="accordion-search" onSubmit={searchHandler}>
				<button type="button" onClick={prevClickHandler} disabled={count <= 0}>{`<<`}</button>
				<button type="button" onClick={prevClickHandler} disabled={count <= 0}>prev</button>
				<input type="text" placeholder="Search"
					onChange={(e) => setSearchInput(e.target.value)} />
				<button type="button" onClick={nextClickHandler} disabled={count >= activeKeys.length - 1}>Next</button>
				<button type="button" onClick={nextClickHandler} disabled={count >= activeKeys.length - 1}>{`>>`}</button>
			</form>
		</div>
	);
}

export default AccordionGenerator;
