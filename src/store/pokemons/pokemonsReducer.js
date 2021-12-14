/* eslint-disable default-param-last */
import {POKEMONS_CATCH_POKEMON, POKEMONS_GET_POKEMONS, POKEMONS_RELEASE_POKEMON, POKEMONS_UPDATE_POKEMONS} from '../types';

const initialState = {
	quantity: null,
	all: [],
	collection: new Map(),
};

export const pokemonsReducer = (state = initialState, action) => {
	switch (action.type) {
		case POKEMONS_GET_POKEMONS:
			return {...state, all: action.payload, quantity: action.payload.length};

		case POKEMONS_UPDATE_POKEMONS: {
			const newAll = state.all.concat();
			action.payload.forEach(unit => {
				const index = newAll.findIndex(item => item.id === unit.id);
				newAll[index] = unit;
			});
			return {...state, all: newAll};
		}

		case POKEMONS_CATCH_POKEMON: {
			const newCollection = new Map(state.collection);
			const {id, dateCollected} = action.payload;
			newCollection.set(id, {dateCollected});
			return {...state, collection: newCollection};
		}

		case POKEMONS_RELEASE_POKEMON: {
			const newCollection = new Map(state.collection);
			newCollection.delete(action.payload);
			return {...state, collection: newCollection};
		}

		default: return state;
	}
};
