import React from 'react';
import PropTypes from 'prop-types';

import './PageSwitcher.scss';

const PageSwitcher = props => {
	const {pagesQuantity, currentPage, onPageChange, pageSlots, isSub} = props;

	const slotsOffset = [...Array(Math.floor(pageSlots / 2) || 0)].map(() => '');
	const pages = slotsOffset.concat([...Array(pagesQuantity || 1).keys()].map(u => u + 1), slotsOffset);
	const maxPagesToShow = pageSlots || 1;
	const pagesFrom = Math.min(currentPage - 1, pages.length - maxPagesToShow);
	const pagesTo = currentPage + maxPagesToShow - 1;

	const pagesToShow = pages.length <= maxPagesToShow ? pages : pages.slice(pagesFrom, pagesTo);

	const firstPageButtonText = '<<';
	const previousButtonText = '<';
	const lastPageButtonText = '>>';
	const nextButtonText = '>';

	return (
		<div className={`page-switcher${isSub ? ' sub' : ''}`}>
			<button onClick={() => onPageChange(1)} disabled={currentPage === 1}>{firstPageButtonText}</button>
			<button onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>{previousButtonText}</button>
			{pagesToShow.map((unit, index) => (
				<button
					key={index}
					onClick={unit === '' ? () => '' : e => onPageChange(Number(e.target.innerText))}
					className={unit === currentPage ? 'current' : unit === '' ? 'inactive' : ''}
				>{unit}</button>
			))}
			<button onClick={() => onPageChange(Math.min(currentPage + 1, pagesQuantity))} disabled={currentPage === pagesQuantity}>{nextButtonText}</button>
			<button onClick={() => onPageChange(pagesQuantity)} disabled={currentPage === pagesQuantity}>{lastPageButtonText}</button>
		</div>);
};

PageSwitcher.propTypes = {
	pageSlots: PropTypes.number,
	pagesQuantity: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	isSub: PropTypes.bool,
};

export default PageSwitcher;
