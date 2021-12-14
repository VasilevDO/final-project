export function BeautifulDate(params) {
	this.date = params ? new Date(params) : new Date();
}

Object.defineProperty(BeautifulDate.prototype, 'timeStr', {
	get() {
		const hours = `0${this.date.getHours()}`.slice(-2);
		const minutes = `0${this.date.getMinutes()}`.slice(-2);
		return `${hours}:${minutes}`;
	},
	enumerable: true,
});

Object.defineProperty(BeautifulDate.prototype, 'bDate', {
	get() {
		const year = this.date.getFullYear();
		const month = this.date.getMonth();
		const monthName = this.monthNames[month];
		const weekdayName = this.weekdayNames[this.date.getDay()];
		const day = `0${this.date.getDate()}`.slice(-2);
		const bDate = `${this.timeStr} ${weekdayName}, ${day} ${monthName} ${year}`;
		return bDate;
	},
	enumerable: true,
});

Object.defineProperty(BeautifulDate.prototype, 'toString', {
	value() {
		return this.bDate;
	},
});

Object.defineProperty(BeautifulDate.prototype, 'weekdayNames', {
	get() {
		return [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
	},
	enumerable: true,
});
Object.defineProperty(BeautifulDate.prototype, 'monthNames', {
	get() {
		return [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
	},
	enumerable: true,
});
