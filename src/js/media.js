export default class Media {
    constructor() {
        this.audioButton = document.getElementsByClassName('form__audio').item(0);
        this.videoButton = document.getElementsByClassName('form__video').item(0);
        this.saveButton = document.getElementsByClassName('form__save').item(0);
        this.cancelButton = document.getElementsByClassName('form__cancel').item(0);
        this.timer = document.getElementsByClassName('form__timer').item(0);
        this.messages = document.getElementsByClassName('messages').item(0);
        this.save = null;
        this.timerId = null;
        this.sec = 0;
        this.min = 0;
        this.recorder = null;
        this.chunks = [];
    }

    createAudioElement(box, src, coordinates, date) {
        box.insertAdjacentHTML('beforeend', `
            <li class="messages__box">
                <div class="messages__wrapper">
                    <audio class="audio" controls src="${src}"></audio>
                    <span class="messages__coordinates">[${coordinates}]</span>
                </div>
                <time class="messages__time">${date}</time>   
            </li>
        `);
    }

    toggleButtons() {
        this.videoButton.classList.toggle('hidden');
        this.audioButton.classList.toggle('hidden');
        this.saveButton.classList.toggle('hidden');
        this.cancelButton.classList.toggle('hidden');
    }

    addZero(num) {
        if(num < 10)  return `0${num}`;
    
        return num;
    }

    runTimer() {
        this.timer.classList.toggle('hidden');
        
        this.timerId = setInterval(() => {
            this.sec++;
            if(this.sec == 60) {
                this.sec = 0;
                this.min++;
            }

            this.timer.innerText = `${this.addZero(this.min)}:${this.addZero(this.sec)}`;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timer.classList.toggle('hidden');
        this.timer.innerText = '00:00';
        this.timerId = null;
        this.sec = 0;
        this.min = 0;
    }

    recorderStartListener(stream) {
        this.recorder.addEventListener('start', (evt) => {
            this.runTimer();
            
            const saveStream = () => {
                this.save = 'save';
                this.recorder.stop();
                stream.getTracks().forEach(track => track.stop());
                this.saveButton.removeEventListener('click', saveStream);
                this.cancelButton.removeEventListener('click', stopStream);
            }
            const stopStream = () => {
                this.recorder.stop();
                stream.getTracks().forEach(track => track.stop());
                this.cancelButton.removeEventListener('click', stopStream);
                this.saveButton.removeEventListener('click', saveStream);
            }
            
            this.saveButton.addEventListener('click', saveStream);
            this.cancelButton.addEventListener('click', stopStream);
        });
    }

    recorderAvailableListener() {
        this.recorder.addEventListener("dataavailable", (evt) => {
            this.chunks.push(evt.data); 
        });
    }

    recorderStopListener(box, coordinates, date) {
        this.recorder.addEventListener('stop', (evt) => {
            this.stopTimer();
            
            if(this.save === 'save') {
                const blob = new Blob(this.chunks);
                const audioSrc = URL.createObjectURL(blob);
                this.createAudioElement(box, audioSrc, coordinates, date);
                this.messages.lastElementChild.scrollIntoView(true);
                this.save = null;
            }
            
            this.toggleButtons();
        })
    }

    getAudio(box, coordinates, date) {
        (async() => {
            if(!navigator.mediaDevices || !window.MediaRecorder) {
                
                return;
            } try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio:true,
                    video:false,
                });
                
                this.recorder = new MediaRecorder(stream);
                this.recorderStartListener(stream);
                this.recorderAvailableListener();
                this.recorderStopListener(box, coordinates, date);
                this.recorder.start();
                    
            } catch(e) {
                console.error(e);
            }
        })();
     }
}

