import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useParams} from 'react-router';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import {firstCharToUpperCase} from '../../pwnzf/pwnzf';
import PwnzfButton from '../../pwnzf/pwnzfComponents/PwnzfButton/PwnzfButton';
import {getFullPokemons, pokemonsCatchPokemon, pokemonsReleasePokemon} from '../../store/pokemons/pokemonsActions';
import {useNavigate} from 'react-router-dom';

import './PokemonPage.scss';

const PokemonPage = () => {
	const params = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {pokemonName} = params;
	const [loading, setLoading] = useState(true);

	const {all, collection} = useSelector(state => state.pokemons);
	const [pokemon, setPokemon] = useState(null);

	useEffect(() => {
		const pokemon = all.find(unit => unit.name === pokemonName);
		if (pokemon && !pokemon.isLoaded) {
			dispatch(getFullPokemons([pokemon]));
		} else {
			setPokemon(pokemon);
		}
	}, [all]);

	if (!pokemon) {
		return null;
	}

	const tableArr = pokemon.getDataArr();

	const backButtonText = 'Return';

	const pokemonInCollection = collection.get(pokemon.id);

	const catchButtonText = pokemonInCollection ? 'Release' : 'Catch';

	const caughtText = pokemonInCollection ? `Collected: ${pokemonInCollection.dateCollected.bDate}` : '';

	const handleCatchChange = () => {
		if (pokemonInCollection) {
			dispatch(pokemonsReleasePokemon(pokemon.id));
		} else {
			dispatch(pokemonsCatchPokemon(pokemon.id));
		}
	};

	return (
		<div className="pokemon-page">
			<div className="pokemon-page-inner">
				<div className="pokemon-page-header">
					<h1>{firstCharToUpperCase(pokemon.name)}</h1>
					{pokemonInCollection
						? <p>{caughtText}</p>
						: null}
				</div>
				<div className="pokemon-page-card">
					<table>
						<tbody>
							{tableArr.map((unit, index) => (
								<tr key={index}>
									<th>{firstCharToUpperCase(unit[0])}</th>
									<td>{Array.isArray(unit[1])
										? unit[1].map((subUnit, subIndex) => (<span key={subIndex}>{firstCharToUpperCase(subUnit).replace(/-/, ' ')}<br/></span>))
										: firstCharToUpperCase(unit[1])
									}</td>
								</tr>
							))}
						</tbody>
					</table>
					<img src={pokemon.picture} onLoad={() => setLoading(false)}/>
				</div>
				<div className="pokemon-page-controls">
					<div>
						<PwnzfButton text={backButtonText} action={() => navigate(-1)}></PwnzfButton>
					</div>
					<div>
						<PwnzfButton text={catchButtonText} action={handleCatchChange}></PwnzfButton>
					</div>
				</div>
				{loading ? <LoadingScreen/> : null}
			</div>
		</div>
	);
};

export default PokemonPage;

