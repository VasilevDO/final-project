import React from 'react';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import NavUl from '../NavUl/NavUl';

import './Navbar.scss';

const Navbar = () => (
	<nav className="navbar">
		<div className="navbar-hamburger-menu">
			<HamburgerMenu/>
		</div>
		<div className="navbar-main-nav">
			<NavUl/>
		</div>
	</nav>
);

export default Navbar;
