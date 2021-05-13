export default class Controller {
    constructor(geolocation, media) {
        this.geolocation = geolocation;
        this.media = media;
        this.messages = document.getElementsByClassName('messages').item(0);
        this.form = document.getElementsByClassName('form').item(0);
        this.formInput = document.getElementsByClassName('form__input').item(0);
        this.modal = document.getElementsByClassName('modal').item(0);   
        this.modalInput = document.getElementsByClassName('modal__input').item(0);   
        this.modalForm = document.getElementsByClassName('modal__form').item(0);
        this.modalCancel = document.getElementsByClassName('modal__cancel').item(0);
        this.main = document.getElementsByClassName('main').item(0);
        this.currentGeolocation = null; 
        this.error = document.getElementsByClassName('error').item(0);
        this.audioButton = document.getElementsByClassName('form__audio').item(0);
        this.videoButton = document.getElementsByClassName('form__video').item(0);
        this.saveButton = document.getElementsByClassName('form__save').item(0);
        this.cancelButton = document.getElementsByClassName('form__cancel').item(0);
        this.timer = document.getElementsByClassName('form__timer').item(0);
    }

    init() {
        this.formListener();
        this.modalListener();
        this.getCurrentGeolocation();
        // this.scrollToLastmessage();
        this.audioListener();
        this.videoListener();
    }

    createElement(box, text, coordinates, date) {
        box.insertAdjacentHTML('beforeend', `
            <li class="messages__box">
                <div class="messages__wrapper">
                    <p class="messages__text">${text}</p>
                    <span class="messages__coordinates">[${coordinates}]</span>
                </div>
                <time class="messages__time">${date}</time>   
            </li>
        `);
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

    toggleModal() {
        this.main.classList.toggle('background');
        this.modal.classList.toggle('modal__close');
        this.modal.classList.toggle('modal__open');
    }

    getCurrentGeolocation() {
        this.geolocation.getCoordinatesPromise()
            .then(
                result => {
                    this.currentGeolocation = `${result.latitude}, ${result.longitude}`  
                },
                () => {
                    this.toggleModal();
                }
            );  
    }

    formListener() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if(this.currentGeolocation) {
                if(this.formInput.value) {
                    this.createElement(this.messages, this.formInput.value, this.currentGeolocation, this.getDate());
                    this.formInput.value = '';
                    this.messages.lastElementChild.scrollIntoView(true);
                }
            } else {
                this.toggleModal();
            }
        });
    }

    getFormValidation(geolocation) {
        const valid = this.getValidGeolocation(geolocation);

        if(this.modalInput.value === '') {
            this.error.innerText = 'Введите координаты';
            this.error.classList.remove('error__close');
            this.error.classList.add('error__open');

            return false;
        
        } else if(!valid) {
            this.error.innerText = 'Некорректный ввод';
            this.error.classList.remove('error__close');
            this.error.classList.add('error__open');

            return false;

        } else {
            this.error.classList.add('error__close');
            this.error.classList.remove('error__open');

            return valid;
        }
    }

    getValidGeolocation(geolocation) {
        return geolocation.replace(/[\[\s\]]/g, '').match(/^[0-9]+,[0-9]+$/g);     
    }

    modalListener() {
        this.modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const validGeolocation = this.getFormValidation(this.modalInput.value);
            if(validGeolocation) {
                this.currentGeolocation = validGeolocation;
                this.toggleModal();
            } 
        });

        this.modalCancel.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleModal();
        });
    }

    toggleButtons() {
        this.videoButton.classList.toggle('hidden');
        this.audioButton.classList.toggle('hidden');
        this.saveButton.classList.toggle('hidden');
        this.cancelButton.classList.toggle('hidden');
    }

    scrollToLastmessage() {
        const isMessages = this.messages.hasChildNodes();
        
        if(isMessages) {
            console.log('jack');
            this.messages.lastElementChild.scrollIntoView(true);
        }
    }

    audioListener() {
        this.audioButton.addEventListener('click', () => {
            this.toggleButtons();
            this.media.getMedia(this.messages, this.currentGeolocation, this.getDate(), 'audio');
        });
    }
    
    videoListener() {
        let videoOptions = {facingMode: { ideal: "environment" }};
        // const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

        // const computerOptions = true
        // const mobileOptions = {
        //     // width: { ideal: 1920 },
        //     // height: { ideal: 1080 },
        //     {facingMode: { exact: "environment" }}
            
        // }

        // isMobile ? videoOptions = mobileOptions : videoOptions = computerOptions;
       
        this.videoButton.addEventListener('click', () => {
            this.toggleButtons();
            this.media.getMedia(this.messages, this.currentGeolocation, this.getDate(), 'video', videoOptions);
        });
    }   
} 
