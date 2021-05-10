import '../css/style.css';
import Geolocation from './geolocation.js';
import Media from './media.js';
import Controller from './controller.js';
import Create from './create.js';

const geolocation = new Geolocation();
const media = new Media();
const create = new Create();
const controller = new Controller(geolocation, create, media);

controller.init();




