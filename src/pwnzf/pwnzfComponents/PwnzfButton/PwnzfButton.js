import React from 'react';
import PropTypes from 'prop-types';

import './PwnzfButton.scss';

const PwnzfButton = props => {
	const buttonText = props.text || 'Button';
	const action = props.action || (() => console.log('shpek'));
	return (
		<button className="pwnzfButton" onClick={action}>{buttonText}</button>
	);
};

PwnzfButton.propTypes = {
	text: PropTypes.string,
	action: PropTypes.func,
};

export default PwnzfButton;
