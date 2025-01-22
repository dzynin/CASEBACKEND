import React, { useContext, useState, useRef, useEffect } from 'react';
import Card from 'react-bootstrap';
import Accordion from 'react-bootstrap';
import AccordionContext from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap';
import './accordion.css'; // Import the new CSS file
import { UserContext } from '../App';  // Import UserContext
import { useSocket } from '../shared/SocketContext'; // Import the socket context


function AccordionRenderer({ data }) {
    console.log('Accordion Renderer Data:', data); // Ensure this is logged
    const [searchInput, setSearchInput] = useState('');
    const [activeKeys, setActiveKeys] = useState([]);
    const [active, setActive] = useState('');
    const [count, setCount] = useState(0);
    const { state, dispatch } = useContext(UserContext);
    const [accordionData, setAccordionData] = useState(data);  // Local state to manage accordion data
    const socket = useSocket(); // Get the socket instance from context

    const myRef = useRef();
    // Update local accordion data if props data is empty and state has accordionSections
    useEffect(() => {
        if (data.length === 0 && state.accordionSections && state.accordionSections.length > 0) {
            setAccordionData(state.accordionSections);
        } else {
            setAccordionData(data);
        }
    }, [data, state.accordionSections]);

    // Listen for socket updates
    useEffect(() => {
        if (socket) {
            socket.on('accordion-response', (newData) => {
                console.log('Received accordion-response:', newData);
                setAccordionData(newData);
            });

            return () => {
                socket.off('accordion-response');
            };
        }
    }, [socket]);

    // Logging to monitor the data updates
    useEffect(() => {
        console.log('Accordion Renderer Data:', accordionData);
    }, [accordionData]);

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
        accordionData.forEach((d, index) => {
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
                {Array.isArray(accordionData) && accordionData.map((d, index) => (
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
        </div>
    );
}

export default AccordionRenderer;
