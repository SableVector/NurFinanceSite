window.addEventListener('DOMContentLoaded', () => {

	const searchBtn = document.querySelector('.header__bottom-search-btn');
	const searchInput = document.querySelector('.header__bottom-search-input');

	searchBtn.addEventListener('click', (e) => {
		searchInput.classList.toggle('header__bottom-search-input--active');
	})

});



































// import Slider from './modules/slider';

// window.addEventListener('DOMContentLoaded', () => {

//     const slider = new Slider('.page', '.next');
//     slider.render();

// });