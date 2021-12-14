import React, {useEffect, useState} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import useRoutes from './Pages/routes';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import {getPokemons} from './store/pokemons/pokemonsActions';

import './App.scss';
import WindowJumper from './components/WindowJumper/WindowJumper';
import {appGetUser} from './store/app/appActions';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

const App = () => {
	const dispatch = useDispatch();
	const {isSomethingWrong} = useSelector(state => state.app);
	const {all} = useSelector(state => state.pokemons);
	const [windowJumper, setWindowJumper] = useState(false);

	useEffect(() => {
		const windowJumperCheck = () => {
			const headerHeight = document.querySelector('.header').getBoundingClientRect().height;
			const offset = window.pageYOffset;
			if (offset > headerHeight) {
				setWindowJumper(true);
			} else if (offset <= headerHeight) {
				setWindowJumper(false);
			}
		};

		window.addEventListener('scroll', windowJumperCheck);

		const dropmenuCheck = e => {
			if (!e.target.closest('.dropmenu') || e.target.closest('a')) {
				[...document.querySelectorAll('.dropmenu')].forEach(unit => {
					unit.querySelector('.dropmenu-content').classList.remove('visible');
					unit.querySelector('.dropmenu-button').classList.remove('opened');
				});
			}
		};

		window.addEventListener('click', dropmenuCheck);

		dispatch(appGetUser());
		dispatch(getPokemons());

		return () => {
			window.removeEventListener('scroll', windowJumperCheck);
			window.removeEventListener('click', dropmenuCheck);
		};
	}, []);

	const routes = useRoutes();

	return (
		<div className="app">
			<Router>
				<Header className="header"/>
				<div className="main-container">
					{isSomethingWrong
						? <h1>Something went wrong, try again later</h1>
						: all && all.length ? routes : <LoadingScreen/>
					}</div>
				<Footer className="footer"/>
				{windowJumper ? <WindowJumper/> : null}
			</Router>
		</div>
	);
};

export default App;
