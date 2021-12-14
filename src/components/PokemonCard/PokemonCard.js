import React from 'react';
import PropTypes from 'prop-types';

import PwnzfButton from '../../pwnzf/pwnzfComponents/PwnzfButton/PwnzfButton';
import {firstCharToUpperCase} from '../../pwnzf/pwnzf';

import './PokemonCard.scss';
import {useNavigate} from 'react-router-dom';

import {useDispatch} from 'react-redux';
import {pokemonsCatchPokemon, pokemonsReleasePokemon} from '../../store/pokemons/pokemonsActions';

const PokemonCard = props => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {pokemon, onReady, isCollected} = props;

	const navToPokemonPage = () => {
		navigate(`/${pokemon.name}`);
	};

	const imgSrc = pokemon.picture;

	const buttonText = isCollected ? 'Release' : 'Catch';

	const handleCatchChange = () => {
		if (isCollected) {
			dispatch(pokemonsReleasePokemon(pokemon.id));
		} else {
			dispatch(pokemonsCatchPokemon(pokemon.id));
		}
	};

	return (
		<div className="pokemon-card">
			<p>{firstCharToUpperCase(pokemon.name)}
				<br/>
		# {pokemon.id}</p>
			<img src={imgSrc} alt={pokemon.name} onClick={navToPokemonPage} tabIndex={0} onLoad={() => onReady(true)}/>
			<PwnzfButton text={buttonText} action={handleCatchChange}></PwnzfButton>
		</div>
	);
};

PokemonCard.propTypes = {
	pokemon: PropTypes.object.isRequired,
	onReady: PropTypes.func.isRequired,
	isCollected: PropTypes.bool.isRequired,
};

export default PokemonCard;

