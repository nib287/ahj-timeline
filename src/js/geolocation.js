export default class Geolocation {
    getCoordinatesPromise() {
        if(navigator.geolocation) {
            return new Promise((resolve, reject) => {
                const success = (pos) => {
                    resolve(pos.coords);
                };
                
                const error = (err) => {
                    reject(err);
                };
                
                navigator.geolocation.getCurrentPosition(success, error);
            });
        } 
    }
}