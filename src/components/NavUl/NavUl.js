import React from 'react';
import {Link} from 'react-router-dom';

import './NavUl.scss';

const NavUl = () => {
	const links = [{
		text: 'List',
		path: '/pokemons',
	}, {
		text: 'Collection',
		path: '/collection',
	}];
	return (
		<ul className="nav-ul">
			{links.map(unit => (
				<li key={unit.path} >
					<Link to={unit.path}><span>{unit.text}</span></Link>
				</li>
			))}
		</ul>
	);
};

export default NavUl;
