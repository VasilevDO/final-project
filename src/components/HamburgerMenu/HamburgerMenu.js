import React, {useRef} from 'react';
import NavUl from '../NavUl/NavUl';

import './HamburgerMenu.scss';

const HamburgerMenu = () => {
	const itemsRef = useRef();
	const buttonRef = useRef();

	const toggleMenu = () => {
		if (itemsRef.current.classList.contains('visible')) {
			itemsRef.current.classList.remove('visible');
			buttonRef.current.classList.remove('opened');
		} else {
			itemsRef.current.classList.add('visible');
			buttonRef.current.classList.add('opened');
		}
	};

	return (
		<div className="hamburger-menu dropmenu">
			<div className="hamburger-menu-button dropmenu-button" onClick={toggleMenu} ref={buttonRef}>
				<div className="hamburger-menu-lines">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<div className="hamburger-menu-items dropmenu-content" ref={itemsRef}>
				<NavUl/>
			</div>
		</div>
	);
};

export default HamburgerMenu;
