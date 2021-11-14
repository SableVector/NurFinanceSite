/* Название папки с финальным проектом */
let projectFolder = require('path').basename(__dirname);
/* название папки с рабочими файлами проекта */
let sourceFolder = "src";
/* переменная для подключения шрифтов в стили */
let fs = require('fs');

/* Переменные для файлов и папок */
let path = {
	/* Путь выгрузки оброботанных файлов Gulp-ом */
	build: {
		/* Папка с html файлами */
		html: projectFolder + "/",
		/* Папка с css файлами */
		css: projectFolder + "/css/",
		/* Папка с js файлами */
		js: projectFolder + "/js/",
		/* Папка с img файлами */
		img: projectFolder + "/img/",
		/* Папка с fonts файлами */
		fonts: projectFolder + "/fonts/",
		/* Папка с дополнениями libs */
		libs: projectFolder + "/libs/",
	},

	/* Путь загрузки файлов для оброботки Gulp-ом  */
	src: {
		/* Папка с html файлами */
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
		/* Папка с scss файлами */
		scss: sourceFolder + "/scss/**/*.scss",
		/* Папка с style.scss файлом */
		css: sourceFolder + "/scss/style.scss",
		/* Папка с main.js файлом */
		js: sourceFolder + "/js/*.js",
		/* Папка с изображениями jpg,png,svg,gif,ico,webp */
		img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		/* Папка с SVG ионками */
		iconSvg: sourceFolder + "/img/icons/**/*.svg",
		/* Папка с ttf шрифтами */
		fonts: sourceFolder + "/fonts/*.ttf",
		/* Папка с css файлами */
		coppyCss: sourceFolder + "/css/*.css",
		/* Папка с дополнениями libs */
		libs: sourceFolder + "/libs/**/*.*",
	},

	/* Путь отслеживания файлов Gulp-ом */
	watch: {
		/* Папка с html файлами */
		html: sourceFolder + "/**/*.html",
		/* Папка с scss файлами */
		css: sourceFolder + "/scss/**/*.scss",
		/* Папка с main.js файлом */
		js: sourceFolder + "/js/**/*.js",
		/* Папка с изображениями jpg,png,svg,gif,ico,webp */
		img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		/* Папка с css файлами */
		coppyCss: sourceFolder + "/css/**/*.css",
		/* Папка с дополнениями libs */
		libs: projectFolder + "/libs/**/*.*",
		/* Папка с SVG ионками */
		iconSvg: sourceFolder + "/img/icons/**/*.svg",
	},

	/* Путь удаление папки при каждом запуске Gulp */
	clean: "./" + projectFolder + "/"
};

/*  */
let
	{ src, dest } = require('gulp'),
	/* Переменные для модулей */
	gulp = require('gulp'),
	/* Автоматическое обновление браузера */
	browsersync = require('browser-sync').create(),
	/* Блочная сборка HTML-страницы */
	fileinclude = require('gulp-file-include'),
	/* Модуль для удаления */
	del = require('del'),
	/* Сборщик препроцессора SASS */
	scss = require('gulp-sass'),
	/* Простовление автопрефиксов в CSS фалах */
	autoprefixer = require('gulp-autoprefixer'),
	/* Дополнение для gulp-autoprefixer */
	groupMedia = require('gulp-group-css-media-queries'),
	/* Преображение CSS файлов */
	clean_css = require('gulp-clean-css'),
	/* Переименование файлов */
	rename = require('gulp-rename'),
	/* переменная для дополнения gulp-uglify-es */
	uglify = require('gulp-uglify-es').default,
	/* Минификация изображений */
	imagemin = require('gulp-imagemin'),
	/* Конвертация ttf шрифтов в woff */
	ttf2woff = require('gulp-ttf2woff'),
	/* Конвертация ttf шрифтов в woff2 */
	ttf2woff2 = require('gulp-ttf2woff2'),
	/* Плагин подмножества шрифтов и конвертации для gulp */
	fonter = require('gulp-fonter'),
	/* Стиль кода */
	gulpStylelint = require('gulp-stylelint'),
	/* Форматирования кода в старый формат */
	babel = require('gulp-babel'),
	/* Сборщик модулей WEBPACK */
	webpack = require('webpack-stream'),
	/* Создание SVG Sprite */
	svgSprite = require('gulp-svg-sprite');
/* Минимизация HTML файлов */
// htmlmin = require('gulp-htmlmin');





/* Функция для обновления страницы */
const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: "./" + projectFolder + "/",
			serveStaticOptions: {
				extensions: ["html"]
			}
		},
		port: 3000,
		notify: false,
		browser: "chrome"
	})
}

/* Функция для работы с html файлами */
const html = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		// .pipe(htmlmin({  
		// 	collapseWhitespace: true 
		// }))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

/* Функция для оброботки css файлов*/
const css = () => {
	return src(path.src.css)
		.pipe(
			scss({
				/* метот сжатия scss */
				outputStyle: "expanded"
			})
		)
		.pipe(
			groupMedia()
		)
		.pipe(
			/* настройки для автопрефикса */
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			}))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

/* Функция для обработки порядка свойств scss */
const lintCss = () => {
	return src(path.src.scss)
		.pipe(gulpStylelint({
			reporters: [
				{
					formatter: 'string',
					console: true
				}
			]
		}));
}

/* Функция для копирования папки css */
const coppyCss = () => {
	return src(path.src.coppyCss)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
}

/* Функция для работы с javascript файлами */
const js = () => {
	return src(path.src.js)
		// .pipe(fileinclude())
		.pipe(
			webpack({

				mode: 'production',
				output: {
					filename: 'main.js'
				},
				module: {
					rules: [
						{
							test: /\.m?js$/,
							use: ['cache-loader'],
							exclude: /(node_modules|bower_components)/,
						}
					]
				}

			})
		)
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

const createSvgSprite = () => {
	return src(path.src.iconSvg)
		.pipe(svgSprite(
			config = {
				mode: {
					symbol: {
						sprite: 'sprite.svg',
						example: true
					}
				}
			}
		))
		.pipe(dest(path.build.img + '/icons'))
		.pipe(browsersync.stream());
};

/* Функция для работы с img файлами */
const images = () => {
	return src(path.src.img)
		/* настройка сжатия картинок */
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 3 }),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false }
					]
				})
			]))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

/* Функция для работы с шрифтами */
const fonts = () => {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

/* Функция для конвертации шрифтов формата otf в ttf */
const otf2ttf = () => {
	return src([sourceFolder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(sourceFolder + '/fonts/'))
}

/* функция которая отвечает за запись и подключение шрифтов к файлу стилей */
const fontsStyle = () => {
	let file_content = fs.readFileSync(sourceFolder + '/scss/global/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(sourceFolder + '/scss/global/_fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(sourceFolder + '/scss/global/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

const cb = () => { }

/* Фуркция для копирования папки с ее содержимым */
const coppyDir = () => {
	return src(path.src.libs)
		.pipe(dest(path.build.libs))
}

/* Функция для отслеживания изменений */
const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.coppyCss], coppyCss);
	gulp.watch([path.watch.css], lintCss);
	gulp.watch([path.watch.iconSvg], createSvgSprite);
}

/* Функция для удаления папки при каждом запуске Gulp*/
const clean = () => {
	return del(path.clean);
}





/* переменная для отслеживания (дружба между Gulp и переменными) */
let build = gulp.series(clean, otf2ttf, createSvgSprite, gulp.parallel(js, css, html, images, fonts, coppyCss, coppyDir, lintCss), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.createSvgSprite = createSvgSprite;
exports.otf2ttf = otf2ttf;
exports.babel = babel;
exports.lintCss = lintCss;
exports.coppyDir = coppyDir;
exports.coppyCss = coppyCss;
exports.fontsStyle = fontsStyle;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
