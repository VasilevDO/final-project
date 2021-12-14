import axios from 'axios';
import {POKEMON_API_URL} from '../../consts';
import {BeautifulDate} from '../../Models/BeautifulDate';
import {Pokemon} from '../../Models/Pokemon';
import {APP_SOMETHING_WENT_WRONG, POKEMONS_CATCH_POKEMON, POKEMONS_GET_POKEMONS, POKEMONS_RELEASE_POKEMON, POKEMONS_UPDATE_POKEMONS} from '../types';

export function getPokemons() {
	return async dispatch => {
		try {
			const {count} = await axios.get(POKEMON_API_URL).then(resp => resp.data);
			const params = `?limit=${count}`;
			const {results} = await axios.get(`${POKEMON_API_URL}${params}`).then(resp => resp.data);
			dispatch({
				type: POKEMONS_GET_POKEMONS,
				payload: results.map(unit => new Pokemon(unit.name, unit.url)),
			});
		} catch {
			dispatch({
				type: APP_SOMETHING_WENT_WRONG,
			});
		}
	};
}

export function getFullPokemons(pokemonsArr) {
	return async dispatch => {
		try {
			const fullyLoadedPokemons = await Promise.all(pokemonsArr.map(async unit => {
				const newPokemon = new Pokemon(unit.name, unit.url);
				await newPokemon.load();
				return newPokemon;
			}));
			dispatch({
				type: POKEMONS_UPDATE_POKEMONS,
				payload: fullyLoadedPokemons,
			});
		} catch {
			dispatch({
				type: APP_SOMETHING_WENT_WRONG,
			});
		}
	};
}

export function pokemonsCatchPokemon(pokemonId) {
	const payload = {
		id: pokemonId,
		dateCollected: new BeautifulDate(),
	};
	return dispatch => {
		dispatch({
			type: POKEMONS_CATCH_POKEMON,
			payload,
		});
	};
}

export function pokemonsReleasePokemon(pokemonId) {
	return dispatch => {
		dispatch({
			type: POKEMONS_RELEASE_POKEMON,
			payload: pokemonId,
		});
	};
}
