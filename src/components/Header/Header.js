import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

import './Header.scss';

const Header = () => {
	const logoText = 'Pokedex';
	const logoLink = '/';
	return (
		<div className="header">
			<div className="header-logo">
				<Link to={logoLink}><h1>{logoText}</h1></Link>
			</div>
			<Navbar/>
		</div>
	);
};

export default Header;
