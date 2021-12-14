import React from 'react';
import PwnzfButton from '../../pwnzf/pwnzfComponents/PwnzfButton/PwnzfButton';

import './Searchbar.scss';

const Searchbar = () => (
	<div className="searchbar">
		<span>Whats crackin?</span>
		<input className="pwnzf-input"></input>
		<PwnzfButton text={'kekw'}/>
	</div>
);

export default Searchbar;
