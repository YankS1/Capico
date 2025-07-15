'use strict'

/**
 * Основной JavaScript файл проекта Capico
 * Содержит инициализацию слайдеров, анимации и другие интерактивные элементы
 */

// Структура кода разделена на модули
const APP = {
	/**
	 * Инициализация приложения
	 */
	init() {
		// Инициализируем все компоненты
		this.sliders.init()
		this.langSwitcher.init()
		this.burgerMenu.init()
		this.animations.init()
		this.logoAnimations.init()
	},

	/**
	 * Модуль для работы со слайдерами
	 */
	sliders: {
		/**
		 * Инициализация всех слайдеров
		 */
		init() {
			this.initConditionsSlider()
			document.addEventListener('DOMContentLoaded', () => {
				this.initFeaturesSlider()
			})
		},

		/**
		 * Инициализация слайдера условий
		 */
		initConditionsSlider() {
			new Swiper('.conditions__slider', {
				slidesPerView: 5,
				pagination: {
					el: '.swiper-pagination',
					type: 'progressbar',
				},
				navigation: {
					nextEl: '.conditions__slider-next',
					prevEl: '.conditions__slider-prev',
				},
				breakpoints: {
					320: {
						slidesPerView: 1,
					},
					576: {
						slidesPerView: 2,
					},
					768: {
						slidesPerView: 3,
					},
					992: {
						slidesPerView: 4,
					},
					1200: {
						slidesPerView: 5,
					},
				},
			})
		},

		/**
		 * Инициализация слайдера фич
		 */
		initFeaturesSlider() {
			const sliderMenuItems = document.querySelectorAll('.slider-menu__item')

			// Инициализируем Swiper
			const mySwiper = new Swiper('.features__swiper-slider', {
				speed: 800,
				effect: 'coverflow',
				grabCursor: true,
				centeredSlides: true,
				slidesPerView: 'auto',
				coverflowEffect: {
					rotate: 95,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				},
				// autoplay: {
				// 	delay: 3500,
				// 	disableOnInteraction: false,
				// },
				navigation: {
					nextEl: '.slider__arrow-next',
					prevEl: '.slider__arrow-prev',
				},
				on: {
					slideChange: () =>
						this.updateActiveMenuItem(mySwiper, sliderMenuItems),
				},
			})

			// Клик по пункту меню — переключаем слайд
			sliderMenuItems.forEach((item, index) => {
				item.addEventListener('click', () => {
					mySwiper.slideTo(index)
				})
			})

			// При инициализации установить активный пункт меню
			this.updateActiveMenuItem(mySwiper, sliderMenuItems)
		},

		/**
		 * Обновление активного пункта меню слайдера
		 * @param {Swiper} swiper - Экземпляр Swiper
		 * @param {NodeList} menuItems - Элементы меню
		 */
		updateActiveMenuItem(swiper, menuItems) {
			// Убираем активный класс со всех
			menuItems.forEach(item =>
				item.classList.remove('slider-menu__item--active')
			)
			// Ставим на текущий
			const idx = swiper.realIndex
			menuItems[idx].classList.add('slider-menu__item--active')
		},
	},

	/**
	 * Модуль переключателя языков
	 */
	langSwitcher: {
		/**
		 * Инициализация переключателя языков
		 */
		init() {
			document.addEventListener('DOMContentLoaded', () => {
				// Инициализируем все переключатели на странице (и десктоп, и мобильный)
				const switchers = document.querySelectorAll('.lang-switcher')
				switchers.forEach(switcher => {
					const toggleBtn = switcher.querySelector('.lang-switcher__btn')
					const currentLang = switcher.querySelector('.lang-switcher__current')
					const langList = switcher.querySelector('.lang-switcher__list')
					const langItems = switcher.querySelectorAll('.lang-switcher__item')

					if (!toggleBtn || !currentLang || !langList) return

					// Показать/скрыть список языков
					toggleBtn.addEventListener('click', e => {
						e.stopPropagation()
						langList.classList.toggle('active')
						toggleBtn.classList.toggle('open')
					})

					// Выбор языка
					langItems.forEach(item => {
						item.addEventListener('click', () => {
							currentLang.textContent = item.dataset.lang
							langList.classList.remove('active')
							toggleBtn.classList.remove('open')
						})
					})

					// Закрытие по клику вне переключателя
					document.addEventListener('click', e => {
						if (!switcher.contains(e.target)) {
							langList.classList.remove('active')
							toggleBtn.classList.remove('open')
						}
					})
				})
			})
		},
	},

	/**
	 * Модуль бургер-меню
	 */
	burgerMenu: {
		/**
		 * Инициализация бургер-меню
		 */
		init() {
			document.addEventListener('DOMContentLoaded', () => {
				const burgerButton = document.querySelector('.burger-menu')
				const menuList = document.querySelector('.menu__list')

				if (!burgerButton || !menuList) return

				// Обработчик клика по бургер-кнопке
				burgerButton.addEventListener('click', () => {
					burgerButton.classList.toggle('active')
					menuList.classList.toggle('active')
					document.body.classList.toggle('no-scroll')
				})

				// Закрытие меню при клике на пункт меню
				menuList.querySelectorAll('.menu__list-link').forEach(link => {
					link.addEventListener('click', () => {
						burgerButton.classList.remove('active')
						menuList.classList.remove('active')
						document.body.classList.remove('no-scroll')
					})
				})

				// Закрытие меню при клике вне меню
				document.addEventListener('click', e => {
					if (
						!e.target.closest('.burger-menu') &&
						!e.target.closest('.menu__list') &&
						menuList.classList.contains('active')
					) {
						burgerButton.classList.remove('active')
						menuList.classList.remove('active')
						document.body.classList.remove('no-scroll')
					}
				})
			})
		},
	},

	/**
	 * Модуль для управления GSAP анимациями
	 */
	animations: {
		/**
		 * Инициализация GSAP анимаций
		 */
		init() {
			document.addEventListener('DOMContentLoaded', () => {
				// Регистрация GSAP плагинов
				this.registerPlugins()

				// Запуск анимаций только на десктопах
				if (isDesktop()) {
					this.headerAnimations()
					this.contentAnimations()
				}
			})
		},

		/**
		 * Регистрация GSAP плагинов
		 */
		registerPlugins() {
			gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

			if (isDesktop()) {
				ScrollSmoother.create({
					wrapper: '.wrapper',
					content: '.content',
					smooth: 3,
					effects: true,
				})
			}
		},

		/**
		 * Анимации хедера
		 */
		headerAnimations() {
			// Все анимации только на десктопах
			if (!isDesktop()) return

			// Меню
			gsap.from('.menu', {
				y: -150,
				duration: 1.5,
				opacity: 0,
			})

			// Заголовки в хедере
			gsap.from('.header__titles', {
				x: -150,
				duration: 1.5,
				opacity: 0,
			})

			// Заголовок обменников
			gsap.from('.header__exchanges-title', {
				x: -150,
				duration: 1.5,
				opacity: 0,
			})

			// Элементы списка обменников с задержкой
			gsap.from('.exchanges__list-item', {
				duration: 1.5,
				y: -60,
				opacity: 0,
				stagger: 0.2,
				ease: 'power2.out',
				delay: 0.5,
			})

			// Анимация фона хедера при скролле
			gsap.fromTo(
				'.header',
				{
					opacity: 1,
					backgroundColor: 'rgba(0,0,0,1)',
				},
				{
					opacity: 0,
					backgroundColor: 'rgba(0,0,0,0)',
					scrollTrigger: {
						trigger: '.header',
						start: 'top top',
						end: '100%',
						scrub: true,
						toggleActions: 'play reverse play reverse',
					},
				}
			)

			// Анимация видео фона
			gsap.fromTo(
				'.video-bg',
				{
					y: 0,
				},
				{
					y: '-35%',
					ease: 'none',
					scrollTrigger: {
						trigger: '.video-bg',
						start: 'top top',
						end: 'bottom center',
						scrub: 1,
						pin: false,
					},
				}
			)
		},

		/**
		 * Анимации контентных блоков
		 */
		contentAnimations() {
			// Все анимации только на десктопах
			if (!isDesktop()) return

			// Анимация превью секции
			gsap.fromTo(
				'.preview',
				{
					borderRadius: '5%',
				},
				{
					scrollTrigger: {
						trigger: '.preview',
						start: 'top top',
						end: 'bottom top',
						scrub: 1,
						pin: false,
					},
					borderRadius: '0%',
				}
			)

			// Анимация списка статистики
			gsap.fromTo(
				'.stats__numbers',
				{
					y: -150,
					x: -100,
					opacity: 0.1,
				},
				{
					duration: 1.5,
					y: 0,
					x: 0,
					opacity: 1,
					stagger: 0.3,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: '.stats__numbers-list',
						start: 'top 80%',
						end: 'center',
						scrub: 1,
						invalidateOnRefresh: true,
					},
				}
			)

			// Секция преимуществ
			gsap.fromTo(
				'.benefits__content',
				{
					x: 400,
					opacity: 0.1,
				},
				{
					x: 0,
					opacity: 1,
					scrollTrigger: {
						trigger: '.benefits__content',
						start: 'top 100%',
						end: 'center 80%',
						scrub: 1,
						invalidateOnRefresh: true,
					},
				}
			)

			// Секция мульти-графика
			gsap.fromTo(
				'.multichart__content',
				{
					x: -400,
					opacity: 0.1,
				},
				{
					x: 0,
					opacity: 1,
					scrollTrigger: {
						trigger: '.multichart__content',
						start: 'top 100%',
						end: 'center 80%',
						scrub: 1,
						invalidateOnRefresh: true,
					},
				}
			)

			// Секция статистики
			gsap.fromTo(
				'.statistics__content',
				{
					x: 700,
					opacity: 0.1,
				},
				{
					x: 0,
					opacity: 1,
					scrollTrigger: {
						trigger: '.statistics__content',
						start: 'top 100%',
						end: 'center 80%',
						scrub: 1,
						invalidateOnRefresh: true,
					},
				}
			)

			// Анимация масштабирования картинки в секции трейдинга
			gsap.fromTo(
				'.trade__pic-img',
				{
					scale: 1,
				},
				{
					scale: 1.2,
					scrollTrigger: {
						trigger: '.trade',
						start: 'top bottom',
						end: 'bottom top',
						scrub: 1,
						pin: false,
					},
				}
			)

			// Секция безопасности
			gsap.fromTo(
				'.security__content',
				{
					x: 600,
					opacity: 0.1,
				},
				{
					x: 0,
					opacity: 1,
					scrollTrigger: {
						trigger: '.security__content',
						start: 'top 100%',
						end: 'center 80%',
						scrub: 1,
						invalidateOnRefresh: true,
					},
				}
			)

			// Анимация масштабирования картинки в free секции
			gsap.fromTo(
				'.free__pic-img',
				{
					scale: 1,
				},
				{
					scale: 1.2,
					scrollTrigger: {
						trigger: '.trade',
						start: 'top bottom',
						end: 'bottom top',
						scrub: 1,
						pin: false,
					},
				}
			)

			// Партнеры, анимация появления
			gsap.from('.partners__partner', {
				scrollTrigger: {
					trigger: '.partners__partner',
					start: 'top 100%',
					end: 'bottom 20%',
					scrub: 1,
					invalidateOnRefresh: true,
				},
				duration: 2,
				y: -100,
				opacity: 0,
				stagger: 0.3,
				ease: 'power3.out',
				delay: 0.5,
			})
			gsap.fromTo(
				'.prices__content-item',
				{
					opacity: 0.9,
					x: 1000,
				},
				{
					opacity: 1,
					x: 0,
					duration: 2,
					ease: 'power3.out',
					stagger: 0.3,
				}
			)
			gsap.fromTo(
				'.prices__title',
				{
					opacity: 0.9,
					x: -1000,
				},
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: 'power2.out',
					stagger: 0.3,
				}
			)
			gsap.fromTo(
				'.prices__content-title',
				{
					opacity: 0.9,
					x: -1000,
				},
				{
					opacity: 1,
					x: 0,
					delay: 0.5,
					duration: 1,
					ease: 'power2.out',
					stagger: 0.3,
				}
			)
			gsap.fromTo(
				'.prices__content-info',
				{
					opacity: 0.9,
					x: -1000,
				},
				{
					opacity: 1,
					x: 0,
					delay: 0.5,
					duration: 2,
					ease: 'power2.out',
					stagger: 0.3,
				}
			)
			gsap.fromTo(
				'.subscription__item',
				{
					opacity: 0,
					y: 800,
				},
				{
					scrollTrigger: {
						trigger: '.subscription',
						start: 'top 80%',
						end: 'bottom 100%',
						scrub: 3,
						invalidateOnRefresh: true,
					},
					opacity: 1,
					y: 0,
					delay: 0.5,
					duration: 1,
					ease: 'power3.out',
					stagger: 0.5,
				}
			)
		},
	},

	/**
	 * Модуль анимаций логотипов
	 */
	logoAnimations: {
		/**
		 * Инициализация анимаций логотипов
		 */
		init() {
			document.addEventListener('DOMContentLoaded', () => {
				this.initFooterLogoAnimation()
				this.initHeaderLogoAnimation()
			})
		},

		/**
		 * Анимация логотипа в футере
		 */
		initFooterLogoAnimation() {
			const footerLogo = document.querySelector('.footer__item svg')
			if (!footerLogo) return

			footerLogo.addEventListener('mouseenter', function () {
				// Анимация всего логотипа - изменение цвета
				const allPaths = footerLogo.querySelectorAll('path')
				allPaths.forEach(path => {
					path.style.fill = '#8f00ff'
				})

				// Анимация вращения круговых элементов
				const circlePaths = Array.from(allPaths).slice(0, 5) // Берем первые 5 path элементов
				circlePaths.forEach(path => {
					path.style.transformBox = 'fill-box'
					path.style.transformOrigin = 'center'
					path.style.animation = 'spinLogo 2s linear infinite'
				})
			})

			footerLogo.addEventListener('mouseleave', function () {
				// Возврат цвета
				const allPaths = footerLogo.querySelectorAll('path')
				allPaths.forEach(path => {
					path.style.fill = 'white'
					path.style.animation = 'none'
				})
			})
		},

		/**
		 * Анимация логотипа в хедере
		 */
		initHeaderLogoAnimation() {
			const headerLogo = document.querySelector('.header__logo')
			const logoImg = headerLogo && headerLogo.querySelector('svg')
			if (!headerLogo || !logoImg) return

			headerLogo.addEventListener('mouseenter', function () {
				// Применяем эффекты к svg логотипу
				const paths = logoImg.querySelectorAll('path')
				paths.forEach(path => {
					path.style.fill = '#8f00ff'
				})

				// Анимация вращения для первых элементов (круговые части)
				const circlePaths = Array.from(paths).slice(0, 5)
				circlePaths.forEach(path => {
					path.style.transformBox = 'fill-box'
					path.style.transformOrigin = 'center'
					path.style.animation = 'spinLogo 2s linear infinite'
				})
			})

			headerLogo.addEventListener('mouseleave', function () {
				// Возвращаем исходный вид
				const paths = logoImg.querySelectorAll('path')
				paths.forEach(path => {
					path.style.fill = 'white'
					path.style.animation = 'none'
				})
			})
		},
	},
}

// Инициализация приложения
APP.init()

function isDesktop() {
	return (
		!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches
	)
}

/**
 * Переключение видимости пароля по клику на иконку глаза
 */
document.addEventListener('DOMContentLoaded', function () {
	const toggleButtons = document.querySelectorAll(
		'.sign-in-form__toggle-password'
	)
	toggleButtons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			// Находим input, который находится рядом с кнопкой
			const input = btn.parentElement.querySelector('input')
			if (!input) return
			if (input.type === 'password') {
				input.type = 'text'
				btn.setAttribute('aria-label', 'Hide password')
			} else {
				input.type = 'password'
				btn.setAttribute('aria-label', 'Show password')
			}
		})
	})
})

document.addEventListener('DOMContentLoaded', function () {
	const links = document.querySelectorAll('.menu__list-link')
	const currentPath = window.location.pathname.replace(/^\//, '')

	links.forEach(link => {
		const href = link.getAttribute('href')
		if (
			href &&
			href !== '#' &&
			(currentPath === href ||
				currentPath.endsWith('/' + href) ||
				(window.location.pathname === '/' &&
					(href === 'index.html' || href === '')))
		) {
			link.classList.add('menu__list-link--active')
		}
	})
})
