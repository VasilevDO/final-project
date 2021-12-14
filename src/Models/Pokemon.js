import axios from 'axios';

import defaultImg from '../assets/defaultCardImage.png';

export function Pokemon(name, url) {
	this.name = name;
	this.url = url;
	this.isLoaded = false;
	this.getIdFromUrl();
}

Pokemon.prototype.getIdFromUrl = function () {
	const idRegExp = /(?<=pokemon\/)\d+/;
	this.id = Number(this.url.match(idRegExp).toString());
};

Pokemon.prototype.update = async function () {
	const data = await axios.get(this.url).then(resp => resp.data);
	this.picture = data.sprites.other['official-artwork'].front_default || defaultImg;
	this.weight = data.weight;
	this.stats = data.stats.map(unit => `${unit.stat.name}: ${unit.base_stat}`);
	this.abilities = data.abilities.map(unit => unit.ability.name);
	this.types = data.types.map(unit => unit.type.name);
	this.isLoaded = true;
};

Pokemon.prototype.load = async function () {
	if (!this.isLoaded) {
		await this.update();
	}
};

Pokemon.prototype.getDataArr = function () {
	const keysToShow = ['id', 'weight', 'stats', 'abilities', 'types'];
	const tableArr = [];
	Object.getOwnPropertyNames(this).forEach(key => {
		if (keysToShow.includes(key)) {
			if (this[key] && typeof this[key] === 'object' && !Array.isArray(this[key])) {
				tableArr.push([key, this[key].toString()]);
			} else {
				tableArr.push([key, this[key]]);
			}
		}
	});
	return tableArr;
};

