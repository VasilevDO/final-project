/* eslint-disable default-param-last */
// Import { SHOW_LOADER,HIDE_LOADER, GET_USER, SET_USER, APP_START_PROCESSING, APP_END_PROCESSING } from "./types"

import {ITEMS_PER_PAGE_DEFAULT} from '../../consts';
import {APP_CHANGE_ITEMS_PER_PAGE, APP_GET_USER, APP_SOMETHING_WENT_WRONG} from '../types';

const initialState = {
	user: null,
	itemsPerPage: ITEMS_PER_PAGE_DEFAULT,
};

export const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case APP_GET_USER:
			return {...state, user: action.payload};
		case APP_CHANGE_ITEMS_PER_PAGE:
			return {...state, user: {...state.user, itemsPerPage: action.payload}};
		case APP_SOMETHING_WENT_WRONG:
			return {...state, isSomethingWrong: true};

		default: return state;
	}
};
