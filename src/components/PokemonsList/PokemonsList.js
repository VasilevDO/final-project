import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useLocation, useNavigate} from 'react-router';

import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

import './PokemonsList.scss';

import {appChangeItemsPerPage} from '../../store/app/appActions';
import {ITEMS_PER_PAGE_DEFAULT, ITEMS_PER_PAGE_OPTIONS, ITEMS_SEARCH_OPTIONS, ITEMS_SORT_DEFAULT, ITEMS_SORT_OPTIONS, PAGE_NUMBER_DEFAULT} from '../../consts';

import './PokemonsList.scss';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import SearchField from '../SearchField/SearchField';
import Selector from '../Selector/Selector';
import {getFullPokemons} from '../../store/pokemons/pokemonsActions';

const PokemonsList = props => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const {search} = useLocation();
	const controlsRef = useRef();
	const controlsTogglerRef = useRef();

	const {isCollectedOnly} = props;

	const {all, collection} = useSelector(state => state.pokemons);
	const userItemsPerPage = useSelector(state => state.app.user.itemsPerPage);

	const [loading, setLoading] = useState(true);
	const [searchBy, setSearchBy] = useState('');
	const [sortBy, setSortBy] = useState(ITEMS_SORT_DEFAULT);
	const [itemsPerPage, setItemsPerPage] = useState(userItemsPerPage);
	const [pageNumber, setPageNumber] = useState(1);
	const [pokemonsList, setPokemonsList] = useState(isCollectedOnly ? all.filter(u => collection.has(u.id)) : all);
	const [pokemonsToShow, setPokemonsToShow] = useState([]);
	const [pagebarSticker, setPagebarSticker] = useState(false);

	const checkBottomControls = useCallback(() => {
		const windowHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		const appHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		return appHeight > windowHeight;
	}, []);

	const [bottomPageSwitcher, setBottomPageSwitcher] = useState(checkBottomControls());

	useEffect(() => {
		setItemsPerPage(userItemsPerPage);
	}, [userItemsPerPage]);

	useEffect(() => {
		const searchByFromURL = search.match(ITEMS_SEARCH_OPTIONS.search.regExp)?.toString().split('=')[1];
		if (searchByFromURL) {
			setSearchBy(searchByFromURL);
		}

		const sortByFromURL = search.match(ITEMS_SEARCH_OPTIONS.sort.regExp)?.toString().split('=')[1].replace(/%/, ' ');
		if (sortByFromURL) {
			setSortBy(sortByFromURL);
		}

		const itemsPerPageFromURL = Number(search.match(ITEMS_SEARCH_OPTIONS.itemsPerPage.regExp)?.toString().split('=')[1]);
		if (itemsPerPageFromURL) {
			setItemsPerPage(itemsPerPageFromURL);
		}

		const pageNumberFromURL = Number(search.match(ITEMS_SEARCH_OPTIONS.pageNumber.regExp)?.toString().split('=')[1]);
		if (pageNumberFromURL) {
			setPageNumber(Math.min(pageNumberFromURL, Math.ceil(pokemonsList.length / itemsPerPageFromURL)));
		}

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
		const newPokemonsList = isCollectedOnly ? all.filter(unit => collection.has(unit.id)).filter(filterBySearch).sort(sortPokemons) : all.filter(filterBySearch).sort(sortPokemons);
		const newPokemonsToShow = preparePokemonsToShow(newPokemonsList);
		const pokemonsToLoad = newPokemonsToShow.filter(u => !u.isLoaded);
		const maxPage = Math.ceil(newPokemonsList.length / itemsPerPage);
		if (pageNumber > maxPage) {
			setPageNumber(maxPage);
		}

		setPokemonsList(newPokemonsList);

		if (pokemonsToLoad.length) {
			setLoading(true);
			dispatch(getFullPokemons(pokemonsToLoad));
		} else {
			setLoading(false);
			setPokemonsToShow(newPokemonsToShow);
		}
	}, [all, collection, searchBy, sortBy]);

	useEffect(() => {
		const newPokemonsToShow = preparePokemonsToShow(pokemonsList);
		const pokemonsToLoad = newPokemonsToShow.filter(u => !u.isLoaded);
		const maxPage = Math.ceil(pokemonsList.length / itemsPerPage);
		if (pageNumber > maxPage) {
			setPageNumber(maxPage);
			return;
		}

		if (pokemonsToLoad.length) {
			setLoading(true);
			dispatch(getFullPokemons(pokemonsToLoad));
		} else {
			setLoading(false);
			setPokemonsToShow(newPokemonsToShow);
		}
	}, [pageNumber, itemsPerPage]);

	const preparePokemonsToShow = useCallback(arr => arr.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage), [itemsPerPage, pageNumber]);

	const filterBySearch = useCallback(unit => String(unit.name).includes(searchBy) || String(unit.id).includes(searchBy), [searchBy]);

	const sortPokemons = useCallback((a, b) => {
		const [criteria, direction] = sortBy.split(' ');
		const koef = direction === 'asc' ? 1 : -1;
		return a[criteria] > b[criteria] ? Number(koef) : -1 * koef;
	}, [sortBy]);

	useEffect(() => {
		if (checkBottomControls() !== bottomPageSwitcher) {
			setBottomPageSwitcher(!bottomPageSwitcher);
		}
	});

	const handleSortChange = newVal => {
		if (loading) {
			return;
		}

		const newSortBy = ITEMS_SORT_OPTIONS.includes(newVal) ? newVal : ITEMS_SORT_DEFAULT;
		if (newSortBy !== sortBy) {
			const newSearch = createNewSearch(search, ITEMS_SEARCH_OPTIONS.sort, newSortBy);
			setSortBy(newSortBy);
			navigate({
				pathname: location.pathname,
				search: newSearch,
			});
		}
	};

	const navigateToPage = num => {
		if (loading) {
			return;
		}

		const newPageNumber = Math.min(pagesQuantity, Number(num)) || PAGE_NUMBER_DEFAULT;
		if (newPageNumber !== pageNumber) {
			const newSearch = createNewSearch(search, ITEMS_SEARCH_OPTIONS.pageNumber, newPageNumber);
			setPageNumber(Math.min(newPageNumber, Math.ceil(pokemonsList.length / itemsPerPage)));
			navigate({
				pathname: location.pathname,
				search: newSearch,
			});
		}
	};

	const handleItemsPerPageChange = newVal => {
		if (loading) {
			return;
		}

		const newItemsPerPage = Number(newVal) || ITEMS_PER_PAGE_DEFAULT;
		if (itemsPerPage !== newItemsPerPage) {
			const newSearch = createNewSearch(search, ITEMS_SEARCH_OPTIONS.itemsPerPage, newItemsPerPage);
			dispatch(appChangeItemsPerPage(newItemsPerPage));
			navigate({
				pathname: location.pathname,
				search: newSearch,
			});
		}
	};

	const handleSearchChange = inputVal => {
		if (loading) {
			return;
		}

		const newSearchBy = inputVal || '';
		if (newSearchBy !== searchBy) {
			const newSearch = createNewSearch(search, ITEMS_SEARCH_OPTIONS.search, newSearchBy);
			setSearchBy(newSearchBy);
			navigate({
				pathname: location.pathname,
				search: newSearch,
			});
		}
	};

	const toggleControlsVisibility = useCallback(() => {
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
	}, []);

	const createNewSearch = useCallback((search, searchOp, newVal) => {// Search from useLocation, search option, new value
		const params = [...Object.keys(ITEMS_SEARCH_OPTIONS)].reduce((a, u) => {
			if (ITEMS_SEARCH_OPTIONS[u] === searchOp) {
				if (newVal !== searchOp.defaultVal) {
					a[u] = `${ITEMS_SEARCH_OPTIONS[u].text}${newVal}`;
				}
			} else {
				const match = search.match(ITEMS_SEARCH_OPTIONS[u].regExp)?.toString();
				if (match) {
					a[u] = match;
				}
			}

			return a;
		}, {});

		return (Object.keys(params).length ? `?${[...Object.values(params)].join('&')}` : '').replace(/\s/, '%');
	}, []);

	const pagesQuantity = Math.ceil(pokemonsList.length / itemsPerPage) || 1;

	return (
		<div className="pokemons-list">
			<div className="controls">
				<div className="controls-static initial" ref={controlsRef}>
					<SearchField
						holder={'Enter name or id'}
						maxLength={10}
						key={searchBy}
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
						initValue={sortBy}
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
						<PokemonCard pokemon={unit} key={unit.name + index} isCollected={collection.has(unit.id)}/>
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
