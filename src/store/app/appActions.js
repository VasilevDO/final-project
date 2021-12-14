import {USER} from '../../consts';
import {APP_CHANGE_ITEMS_PER_PAGE, APP_GET_USER} from '../types';

export function appChangeItemsPerPage(newItemsPerPage) {
	return {
		type: APP_CHANGE_ITEMS_PER_PAGE,
		payload: newItemsPerPage,
	};
}

export function appGetUser() {
	const user = USER;
	return {
		type: APP_GET_USER,
		payload: user,
	};
}
