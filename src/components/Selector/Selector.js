import React, {useState, useEffect} from 'react';

import PropTypes from 'prop-types';

import './Selector.scss';

const Selector = props => {
	const {initValue, label, options, action} = props;

	const [selectVal, setSelectVal] = useState(initValue || '');

	const handleSelectChange = e => {
		if (action) {
			action(e.target.value);
		}

		setSelectVal(e.target.value);
	};

	useEffect(() => {
		if (selectVal !== initValue) {
			setSelectVal(initValue);
		}
	}, [initValue]);

	return (
		<div className="selector">
			{label ? <span>{label}</span> : null}
			<select onChange={handleSelectChange} value={selectVal}>
				{(options || []).map((unit, index) => (
					<option value={unit} key={index}>{unit}</option>
				))}
			</select>
		</div>
	);
};

Selector.propTypes = {
	initValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	options: PropTypes.array,
	action: PropTypes.func,
};

export default Selector;

