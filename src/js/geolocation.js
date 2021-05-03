export default class Geolocation {
    constructor() {
        this.test = 'test'
    }
    getCoordinates() {
        let response = null

        if(navigator.geolocation) {
            const success = (pos) => {
                this.test = pos;
               
            };
            
            const error = (err) => {
                response = err;
                console.log(response);
            };
              
            navigator.geolocation.getCurrentPosition(success, error);
            setTimeout(() => console.log(this.test), 1000)
        }
         
        
    }
}