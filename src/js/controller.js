export default class Controller {
    constructor(geolocation, create) {
        this.geolocation = geolocation;
        this.create = create;
        this.messages = document.getElementsByClassName('messages').item(0);
        this.form = document.getElementsByClassName('form').item(0);
        console.log(this.form);
    }

    init() {
        this.formListener();
    }

    getDate() {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };
        
        return  new Date().toLocaleString("ru", options);
    }

    formListener() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const inputValue = formData.get('input')
            const date = this. getDate();

            this.geolocation.getCoordinatesPromise()
                .then(
                    result => {
                        this.create.element(this.messages, inputValue, result.latitude, result.longitude, date);
                    },
                    error => {
                        console.log('ошибка');
                    }
                )  
        })
    }
} 