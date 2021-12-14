import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import './PwnzfLinkButton.scss';

const PwnzfLinkButton = props => {
	const buttonText = props.text || 'Link button';
	const link = props.linkTo;
	return (
		<div className="pwnz-link-button">
			<Link to={link}>{buttonText}</Link>
		</div>
	);
};

PwnzfLinkButton.propTypes = {
	text: PropTypes.string,
	linkTo: PropTypes.string.isRequired,
};

export default PwnzfLinkButton;
