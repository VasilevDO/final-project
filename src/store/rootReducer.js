import {combineReducers} from 'redux';
import {appReducer} from './app/appReducer';
import {pokemonsReducer} from './pokemons/pokemonsReducer';

export const rootReducer = combineReducers({
	app: appReducer,
	pokemons: pokemonsReducer,
});
