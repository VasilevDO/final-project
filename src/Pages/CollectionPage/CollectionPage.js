import React from 'react';
import {useSelector} from 'react-redux';
import PokemonsList from '../../components/PokemonsList/PokemonsList';

import './CollectionPage.scss';

const CollectionPage = () => {
	const {collection} = useSelector(state => state.pokemons);

	return collection.size
		? <PokemonsList isCollectedOnly={true}/>
		: <div className="collection-message"><h1 >Your collection is empty</h1></div>;
};

export default CollectionPage;
