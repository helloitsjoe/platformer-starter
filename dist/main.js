/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hero.js":
/*!*********************!*\
  !*** ./src/hero.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Hero; });\nclass Hero {\n  constructor(canvas) {\n    this.width = 20;\n    this.height = 20;\n    this.x = canvas.width / 2 - this.width / 2;\n    this.y = canvas.height - this.height;\n    this.vx = 0;\n    this.vy = 0;\n  }\n\n}\n\n//# sourceURL=webpack:///./src/hero.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hero__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hero */ \"./src/hero.js\");\n/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keyboard */ \"./src/keyboard.js\");\n\n\nconst canvas = document.querySelector('canvas');\nconst ctx = canvas.getContext('2d');\nfillScreen(canvas);\nwindow.addEventListener('resize', () => fillScreen(canvas));\n\nfunction fillScreen(canvas) {\n  canvas.width = window.innerWidth;\n  canvas.height = window.innerHeight;\n}\n\nconst hero = new _hero__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas);\nconst keyboard = new _keyboard__WEBPACK_IMPORTED_MODULE_1__[\"Keyboard\"](window, hero);\nconst GRAVITY = 0.7;\n\nfunction drawHero(deltaTime) {\n  hero.x += hero.vx;\n  hero.y += hero.vy;\n  hero.vy += GRAVITY;\n  checkWallCollision(hero, canvas);\n  ctx.fillStyle = 'white';\n  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);\n}\n\nfunction update(deltaTime) {\n  ctx.fillStyle = 'black';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  drawHero(deltaTime);\n  requestAnimationFrame(update);\n}\n\nfunction checkWallCollision(hero, canvas) {\n  if (hero.y + hero.height > canvas.height) {\n    hero.y = canvas.height - hero.height;\n  }\n\n  if (hero.x < 0) {\n    hero.x = 0;\n    hero.vx *= -1;\n  }\n\n  if (hero.x > canvas.width) {\n    hero.x = canvas.width;\n    hero.vx *= -1;\n  }\n}\n\nupdate();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/keyboard.js":
/*!*************************!*\
  !*** ./src/keyboard.js ***!
  \*************************/
/*! exports provided: Keyboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Keyboard\", function() { return Keyboard; });\nconst V = 5;\nclass Keyboard {\n  constructor(window, hero) {\n    this.hero = hero;\n    window.addEventListener('keydown', this.handleKeydown.bind(this));\n    window.addEventListener('keyup', this.handleKeyup.bind(this));\n  }\n\n  handleKeydown(e) {\n    switch (e.code) {\n      case 'ArrowLeft':\n        this.hero.vx = V * -1;\n        break;\n\n      case 'ArrowRight':\n        this.hero.vx = V;\n        break;\n\n      case 'Space':\n        this.hero.vy = -V * 3;\n        break;\n\n      default:\n        console.log(`e.code:`, e.code);\n    }\n  }\n\n  handleKeyup(e) {\n    switch (e.code) {\n      case 'ArrowLeft':\n      case 'ArrowRight':\n        this.hero.vx = 0;\n        break;\n\n      default:\n        console.log(`e.code:`, e.code);\n    }\n  }\n\n}\n\n//# sourceURL=webpack:///./src/keyboard.js?");

/***/ })

/******/ });