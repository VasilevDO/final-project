import React from 'react';

import './LoadingScreen.scss';

import pokeball from '../../assets/pokeball.png';

const LoadingScreen = () => (
	<div className="loading-screen">
		<div className="loading-screen-wrapper">
			<img src={pokeball}/>
		</div>
	</div>
);

export default LoadingScreen;
