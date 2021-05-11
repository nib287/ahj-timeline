export default class Media {
    constructor() {
        
        this.dubleStream = null;
        this.dubleStreamElement = document.getElementById('dubleStream');
        this.messagesBox = document.getElementsByClassName('messages__box').item(0);
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

    createMediaElement(box, src, coordinates, date, mediaTeg) {
        box.insertAdjacentHTML('beforeend', `
            <li class="messages__box">
                <div class="messages__wrapper">
                    <${mediaTeg} class="${mediaTeg}" controls src="${src}"></${mediaTeg}>
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

            this.playDubleStream();
            

        });
    }

    recorderAvailableListener() {
        this.recorder.addEventListener("dataavailable", (evt) => {
            this.chunks.push(evt.data); 
        });
    }

    recorderStopListener(box, coordinates, date, createEl, mediaTeg) {
        this.recorder.addEventListener('stop', (evt) => {
            this.stopTimer();
            this.stopDubleStream();
            
            if(this.save === 'save') {
                const blob = new Blob(this.chunks);
                const audioSrc = URL.createObjectURL(blob);
                createEl(box, audioSrc, coordinates, date, mediaTeg)
                this.messages.lastElementChild.scrollIntoView(true);
                this.save = null;
            }
            
            this.toggleButtons();
            this.chunks = [];
        })
    }

    getMedia(box, coordinates, date, mediaTeg, video = false) {
        (async() => {
            if(!navigator.mediaDevices || !window.MediaRecorder) {
                
                return;
            } try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: video
                });
                
                this.recorder = new MediaRecorder(stream);
                this.recorderStartListener(stream);
                this.recorderAvailableListener();
                this.recorderStopListener(box, coordinates, date, this.createMediaElement, mediaTeg);
                this.recorder.start();
                    
            } catch(e) {
                console.error(e);
            }
        })();
    }

    playDubleStream() {
        (async() => { 
            try {
                this.messagesBox.classList.toggle('hidden');
                this.dubleStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: true,
                });
                this.dubleStreamElement.srcObject = this.dubleStream;
                this.dubleStreamElement.play();
            } catch(e) {
                console.error(e);
            }
        })();
    }

    stopDubleStream() {
        this.dubleStream.getTracks().forEach(track => track.stop());
        this.dubleStream.srcObject = null;
        this.messagesBox.classList.toggle('hidden');
    }
}

