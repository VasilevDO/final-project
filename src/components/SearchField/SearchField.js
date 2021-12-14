import React, {useState} from 'react';

import PropTypes from 'prop-types';

import './SearchField.scss';

const SearchField = props => {
	const {initValue, action, label, buttonText, holder, maxLength} = props;

	const [inputValue, setInputValue] = useState(initValue || '');

	const handleInputChange = e => {
		setInputValue(e.target.value);
	};

	const handleButtonClick = () => {
		if (action) {
			action(inputValue);
		} else {
			console.log('kek');
		}
	};

	return (
		<div className="search-field">
			{label ? <span>{label}</span> : null}
			<input onChange={handleInputChange} value={inputValue} placeholder={holder || ''} maxLength={maxLength || ''}/>
			<button onClick={handleButtonClick}>{buttonText || 'Beep'}</button>
		</div>
	);
};

SearchField.propTypes = {
	maxLength: PropTypes.number,
	holder: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	initValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	buttonText: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	action: PropTypes.func,
};

export default SearchField;
