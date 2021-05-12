import '../css/style.css';
import Geolocation from './geolocation.js';
import Media from './media.js';
import Controller from './controller.js';

const geolocation = new Geolocation();
const media = new Media();
const controller = new Controller(geolocation, media);

controller.init();




