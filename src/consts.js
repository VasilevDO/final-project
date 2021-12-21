export const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const PAGE_NUMBER_DEFAULT = 1;

export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];
export const ITEMS_PER_PAGE_DEFAULT = ITEMS_PER_PAGE_OPTIONS[1];

export const ITEMS_SORT_OPTIONS = ['id asc', 'id desc', 'name asc', 'name desc'];
export const ITEMS_SORT_DEFAULT = ITEMS_SORT_OPTIONS[0];

export const ITEMS_SEARCH_OPTIONS = {
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

export const USER = {
	name: 'The best user in the world',
	itemsPerPage: ITEMS_PER_PAGE_DEFAULT,
};
