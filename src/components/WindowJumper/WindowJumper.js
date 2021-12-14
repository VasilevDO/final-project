import React from 'react';

import './WindowJumper.scss';

const WindowJumper = () => {
	const windowJumperSymbol = '↑';

	const jumpToTop = () => {
		window.scrollTo({top: 0, behavior: 'smooth'});
	};

	return (
		<div className="window-jumper">
			<span onClick={jumpToTop}>{windowJumperSymbol}</span>
		</div>
	);
};

export default WindowJumper;
