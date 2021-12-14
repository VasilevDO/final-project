import React, {useState} from 'react';
import PropTypes from 'prop-types';

import PageSwitcher from '../PageSwitcher/PageSwitcher';

import './Pagesbar.scss';
import {ITEMS_PER_PAGE_OPTIONS, ITEMS_SORT_OPTIONS} from '../../consts';
import SearchField from '../SearchField/SearchField';

const Pagesbar = props => {
	const {pagesQuantity, currentPage, onPageChange, itemsPerPage, onItemsPerPageChange, onSortChange, sortedBy} = props;

	const itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS;

	const pages = [];
	for (let i = 1; i <= pagesQuantity; i++) {
		pages.push(i);
	}

	const [inputValue, setInputValue] = useState('');

	const handleJump = () => {
		const newPage = Number(inputValue);
		if (isNaN(newPage) || newPage < 1 || newPage > pages.length) {
			setInputValue('Page not found');
		} else {
			setInputValue('');
			onPageChange(newPage);
		}
	};

	const inputPlacehorder = `Pages ${1}-${Math.max(pagesQuantity, 1)}`;

	const selectorText = 'Pokemons per page:';

	const sortOptions = ITEMS_SORT_OPTIONS;
	const sortSelectorText = 'Sorted by:';

	return (
		<div className="pagesbar">
			<div className="jumper">
				<input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={inputPlacehorder}></input>
				<button onClick={handleJump}>Go</button>
			</div>

			<div className="pages">
				<PageSwitcher
					pagesQuantity={pagesQuantity}
					currentPage={currentPage}
					onPageChange={onPageChange}

				/>
			</div>
			<div className="selector">
				<span>{selectorText}</span>
				<select onChange={onItemsPerPageChange} value={itemsPerPage}>
					{itemsPerPageOptions.map((unit, index) => (
						<option value={unit} key={index}>{unit} </option>
					))}
				</select>
			</div>
			<div className="selector">
				<span>{sortSelectorText}</span>
				<select onChange={onSortChange} value={sortedBy}>
					{sortOptions.map((unit, index) => (
						<option value={unit} key={index}>{unit} </option>
					))}
				</select>
			</div>
		</div>);
};

Pagesbar.propTypes = {
	pagesQuantity: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	itemsPerPage: PropTypes.number.isRequired,
	onItemsPerPageChange: PropTypes.func.isRequired,
	sortedBy: PropTypes.string.isRequired,
	onSortChange: PropTypes.func.isRequired,
};

export default Pagesbar;
