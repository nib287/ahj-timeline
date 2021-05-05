import '../css/style.css';
import Geolocation from './geolocation.js';
import Controller from './controller.js';
import Create from './create.js';

const geolocation = new Geolocation();
const create = new Create();
const controller = new Controller(geolocation, create);
controller.init();




