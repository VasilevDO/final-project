import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import CollectionPage from './CollectionPage/CollectionPage';
import PokemonPage from './PokemonPage/PokemonPage';
import PokemonsPage from './PokemonsPage/PokemonsPage';

export const ROUTES_POKEMONS_COLLECTION = 'collection';
export const ROUTES_POKEMONS_ALL = 'pokemons';
export const ROUTES_POKEMONS_POKEMON = ':pokemonName';

const useRoutes = () => (
	<Routes>
		<Route path={ROUTES_POKEMONS_ALL} element={<PokemonsPage/>} />
		<Route path={ROUTES_POKEMONS_POKEMON} element={<PokemonPage/>} />
		<Route path={ROUTES_POKEMONS_COLLECTION} element={<CollectionPage/>} />
		<Route path="*" element={<Navigate to={ROUTES_POKEMONS_ALL} />}/>
	</Routes>
);

export default useRoutes;
