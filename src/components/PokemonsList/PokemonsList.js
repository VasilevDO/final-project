import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

import './PokemonsList.scss';

import {useLocation, useNavigate} from 'react-router';
import {appChangeItemsPerPage} from '../../store/app/appActions';
import {ITEMS_PER_PAGE_DEFAULT, ITEMS_PER_PAGE_OPTIONS, ITEMS_SORT_DEFAULT, ITEMS_SORT_OPTIONS, PAGE_NUMBER_DEFAULT} from '../../consts';

import './PokemonsList.scss';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import SearchField from '../SearchField/SearchField';
import Selector from '../Selector/Selector';
import {getFullPokemons} from '../../store/pokemons/pokemonsActions';

const PokemonsList = props => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {search} = useLocation();
	const controlsRef = useRef();
	const controlsTogglerRef = useRef();

	// Search options
	const searchOps = {
		sort: {
			text: 'sortBy=',
			regExp: /sortBy=\w+%\w+/,
			defaultVal: ITEMS_SORT_DEFAULT,
		},
		pageNumber: {
			text: 'pageNumber=',
			regExp: /pageNumber=\d+/,
			defaultVal: PAGE_NUMBER_DEFAULT,
		},
		itemsPerPage: {
			text: 'itemsPerPage=',
			regExp: /itemsPerPage=\d+/,
			defaultVal: ITEMS_PER_PAGE_DEFAULT,
		},
		search: {
			text: 'search=',
			regExp: /search=\w+/,
			defaultVal: '',
		},
	};

	const [loading, setLoading] = useState(true);
	const [readyCards, setReadyCards] = useState([]);

	const {all, collection} = useSelector(state => state.pokemons);

	const {isCollectedOnly} = props;

	// Filter by search field
	const searchByFromURL = search.match(searchOps.search.regExp)?.toString().split('=')[1];
	const [searchBy, setSearchBy] = useState(searchByFromURL || '');
	const filterBySearch = unit => String(unit.name).includes(searchBy) || String(unit.id).includes(searchBy);

	// Sort
	const sortedByFromURL = search.match(searchOps.sort.regExp)?.toString().split('=')[1].replace(/%/, ' ');

	const [sortedBy, setSortedBy] = useState(ITEMS_SORT_OPTIONS.includes(sortedByFromURL) ? sortedByFromURL : ITEMS_SORT_DEFAULT);

	// Items per page
	const itemsPerPageFromURL = Number(search.match(searchOps.itemsPerPage.regExp)?.toString().split('=')[1]);
	const userItemsPerPage = useSelector(state => state.app.user.itemsPerPage);
	const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS.includes(itemsPerPageFromURL) ? itemsPerPageFromURL : userItemsPerPage);

	// PageNumber
	const pageNumberFromURL = Number(search.match(searchOps.pageNumber.regExp)?.toString().split('=')[1]);

	const [pokemonsList, setPokemonsList] = useState((isCollectedOnly ? all.filter(unit => collection.has(unit.id)) : all));

	useEffect(() => {
		setPokemonsList((isCollectedOnly ? all.filter(unit => collection.has(unit.id)) : all));
	}, [all, collection]);

	const filteredAll = searchBy ? pokemonsList.filter(filterBySearch) : pokemonsList;

	filteredAll.sort(sortPokemons);

	function sortPokemons(a, b) {
		const [criteria, direction] = sortedBy.split(' ');
		const koef = direction === 'asc' ? 1 : -1;
		return a[criteria] > b[criteria] ? Number(koef) : -1 * koef;
	}

	const quantity = filteredAll.length;

	const [pokemonsToShow, setPokemonsToShow] = useState([]);

	const pagesQuantity = Math.ceil(quantity / itemsPerPage) || 1;

	const [pageNumber, setPageNumber] = useState(Math.min(pageNumberFromURL, pagesQuantity) || 1);

	// Bottom page switcher start

	const windowHeight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

	const appHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	const [bottomPageSwitcher, setBottomPageSwitcher] = useState(appHeight > windowHeight);

	useEffect(() => {
		const windowHeight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
		const appHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		setBottomPageSwitcher(appHeight > windowHeight);
	});

	// Bottom page switcher end

	useEffect(() => {
		setItemsPerPage(ITEMS_PER_PAGE_OPTIONS.includes(itemsPerPageFromURL) ? itemsPerPageFromURL : userItemsPerPage);
	}, [userItemsPerPage]);

	useEffect(() => {
		setLoading(true);
		loadPokemonsData();
	}, [pokemonsList, pageNumber, sortedBy, searchBy, itemsPerPage]);

	const [pagebarSticker, setPagebarSticker] = useState(false);

	useEffect(() => {
		const pagesbarStickerCheck = () => {
			const pageSwitchers = document.querySelectorAll('.page-switcher:not(.sub)');

			if (pageSwitchers.length) {
				if ([...pageSwitchers].map(unit => checkIfOnScreen(unit)).filter(unit => unit).length) {
					setPagebarSticker(false);
				} else {
					setPagebarSticker(true);
				}
			}

			function checkIfOnScreen(node) {
				const {top, bottom} = node.getBoundingClientRect();

				const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				return top < windowHeight && bottom > 0;
			}
		};

		window.addEventListener('scroll', pagesbarStickerCheck);

		return () => {
			window.removeEventListener('scroll', pagesbarStickerCheck);
		};
	}, []);

	useEffect(() => {
		if (readyCards >= pokemonsToShow.length) {
			setLoading(false);
		}
	}, [readyCards]);

	const handleReadyCard = () => {
		setReadyCards(readyCards + 1);
	};

	const handleSortChange = newVal => {
		if (loading) {
			return;
		}

		const newSortedBy = ITEMS_SORT_OPTIONS.includes(newVal) ? newVal : ITEMS_SORT_DEFAULT;
		if (newSortedBy !== sortedBy) {
			const newSearch = createNewSearch(search, searchOps.sort, newSortedBy);
			setSortedBy(newSortedBy);
			navigate(newSearch);
		}
	};

	const navigateToPage = num => {
		if (loading) {
			return;
		}

		const newPageNumber = Math.min(pagesQuantity, Number(num)) || PAGE_NUMBER_DEFAULT;
		if (newPageNumber !== pageNumber) {
			const newSearch = createNewSearch(search, searchOps.pageNumber, newPageNumber);
			setPageNumber(newPageNumber);
			navigate(newSearch);
		}
	};

	const handleItemsPerPageChange = newVal => {
		if (loading) {
			return;
		}

		const newItemsPerPage = Number(newVal) || ITEMS_PER_PAGE_DEFAULT;
		if (itemsPerPage !== newItemsPerPage) {
			const newSearch = createNewSearch(search, searchOps.itemsPerPage, newItemsPerPage);
			dispatch(appChangeItemsPerPage(newItemsPerPage));
			navigate(newSearch);
		}
	};

	const handleSearchChange = inputVal => {
		if (loading) {
			return;
		}

		const newSearchBy = inputVal || '';
		if (newSearchBy !== searchBy) {
			const newSearch = createNewSearch(search, searchOps.search, newSearchBy);
			setSearchBy(newSearchBy);
			navigate(newSearch);
		}
	};

	const toggleControlsVisibility = () => {
		controlsRef.current.classList.remove('initial');
		if (controlsRef.current.classList.contains('open')) {
			controlsRef.current.classList.remove('open');
			controlsRef.current.classList.add('close');
			controlsTogglerRef.current.classList.remove('active');
		} else {
			controlsRef.current.classList.add('open');
			controlsRef.current.classList.remove('close');
			controlsTogglerRef.current.classList.add('active');
		}
	};

	function createNewSearch(search, searchOp, newVal) {// Search from useLocation, search option, new value
		const params = [...Object.keys(searchOps)].reduce((a, u) => {
			if (searchOps[u] === searchOp) {
				if (newVal !== searchOp.defaultVal) {
					a[u] = `${searchOps[u].text}${newVal}`;
				}
			} else {
				const match = search.match(searchOps[u].regExp)?.toString();
				if (match) {
					a[u] = match;
				}
			}

			return a;
		}, {});

		return (Object.keys(params).length ? `?${[...Object.values(params)].join('&')}` : '').replace(/\s/, '%');
	}

	function loadPokemonsData() {
		const start = (pageNumber - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const pokemons = filteredAll.slice(start, end);
		const pokemonsToLoad = pokemons.filter(unit => !unit.isLoaded);

		if (pokemonsToLoad.length) {
			setLoading(true);
			dispatch(getFullPokemons(pokemonsToLoad));
		} else {
			let readyCards = 0;
			pokemonsToShow.forEach(unit => {
				if (pokemons.includes(unit)) {
					readyCards += 1;
				}
			});
			setPokemonsToShow(pokemons);
			setReadyCards(readyCards);
		}
	}

	// Async function loadPokemonsData() {
	// 	const start = (pageNumber - 1) * itemsPerPage;
	// 	const end = start + itemsPerPage;
	// 	const pokemons = await Promise.all(filteredAll.slice(start, end).map(async unit => {
	// 		await unit.load();
	// 		return unit;
	// 	}));
	// 	let readyCards = 0;
	// 	pokemonsToShow.forEach(unit => {
	// 		if (pokemons.includes(unit)) {
	// 			readyCards += 1;
	// 		}
	// 	});
	// 	setPokemonsToShow(pokemons);
	// 	setReadyCards(readyCards);
	// }

	return (
		<div className="pokemons-list">
			<div className="controls">
				<div className="controls-static initial" ref={controlsRef}>
					<SearchField
						holder={'Enter name or id'}
						maxLength={10}
						initValue={searchBy}
						action={handleSearchChange}
						buttonText={'Search'}
					/>
					<SearchField
						holder={`Enter page 1 - ${pagesQuantity}`}
						maxLength={10}
						action={navigateToPage}
						buttonText={'Go'}
					/>

					<Selector
						label={'Sort by:'}
						initValue={sortedBy}
						options={ITEMS_SORT_OPTIONS}
						action={handleSortChange}
					/>
					<Selector
						label={'Pokemons on page:'}
						initValue={itemsPerPage}
						options={ITEMS_PER_PAGE_OPTIONS}
						action={handleItemsPerPageChange}
					/>
				</div>
				<div className="controls-toggler" onClick={toggleControlsVisibility} ref={controlsTogglerRef}>
					<button><span>▼</span></button>
				</div>
				<div>
					<PageSwitcher
						pageSlots={5}
						pagesQuantity={pagesQuantity}
						currentPage={pageNumber}
						onPageChange={navigateToPage}
					/>
				</div>

			</div>
			<div className="pokemons-list-cards">
				<div className="inner-wrapper">
					{pokemonsToShow.map((unit, index) => (
						<PokemonCard pokemon={unit} key={unit.name + index} onReady={handleReadyCard} isCollected={collection.has(unit.id)}/>
					))}
				</div>
			</div>
			{bottomPageSwitcher
				? <div className="controls">
					<PageSwitcher
						pagesQuantity={pagesQuantity}
						currentPage={pageNumber}
						onPageChange={navigateToPage}
					/>
				</div>
				: null}
			{pagebarSticker
				? <PageSwitcher
					isSub={true}
					pagesQuantity={pagesQuantity}
					currentPage={pageNumber}
					onPageChange={navigateToPage}
				/>
				: null}

			{loading ? <LoadingScreen/> : null}
		</div>
	);
};

export default PokemonsList;

PokemonsList.propTypes = {
	isCollectedOnly: PropTypes.bool,
};
