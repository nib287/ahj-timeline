export default class Media {
    constructor() {
        this.dubleStream = null;
        this.currentVideoMessage = null;
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

    recorderStartListener(stream, media) {
       
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
                this.currentVideoMessage.remove();
            }
            
            this.saveButton.addEventListener('click', saveStream);
            this.cancelButton.addEventListener('click', stopStream);
           
            if(media == 'video') {
                this.playDubleStream(); 
            }
        });
    }

    recorderAvailableListener() {
        this.recorder.addEventListener("dataavailable", (evt) => {
            this.chunks.push(evt.data); 
        });
    }

    recorderStopListener(box, coordinates, date, createEl, media) {
        this.recorder.addEventListener('stop', (evt) => {
            this.stopTimer();
            if(media == 'video') this.stopDubleStream(); 
            
            if(this.save === 'save') {
                const blob = new Blob(this.chunks);
                const mediaSrc = URL.createObjectURL(blob);
                
                if(media == 'audio') {
                    createEl(box, mediaSrc, coordinates, date, media)
                } else {
                    this.createVideoMessage(coordinates, date, mediaSrc); 
                }               
            }
            
            this.toggleButtons();
            this.chunks = [];

            this.scrollToLastmessage();
            this.save = null;
        })
    }

    scrollToLastmessage() {
        const isMessages = this.messages.hasChildNodes();
        if(isMessages) {
            this.messages.lastElementChild.scrollIntoView(true);
        }
    } 

    getMedia(box, coordinates, date, media, video = false) {    
        (async() => {
            if(!navigator.mediaDevices || !window.MediaRecorder) {
                
                return;
            } try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: video
                });
                
                this.recorder = new MediaRecorder(stream);
                this.recorderStartListener(stream, media);
                this.recorderAvailableListener();
                this.recorderStopListener(box, coordinates, date, this.createAudioElement, media);
                this.recorder.start();
                setTimeout(() => this.scrollToLastmessage(), 300);
                    
            } catch(e) {
                console.error(e);
            }
        })();
    }

    playDubleStream() {
        (async() => { 
            try {
                this.dubleStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },
                });
                
                this.createVideoPlayer();
            } catch(e) {
                console.error(e);
            }
        })();
    }

    stopDubleStream() {
        this.dubleStream.getTracks().forEach(track => track.stop());
        this.dubleStream.srcObject = null;
    }

    createVideoPlayer() {
        const videoEl = document.createElement('video');
        videoEl.classList.add('video');
        videoEl.setAttribute('controls', 'controls');
        videoEl.srcObject = this.dubleStream;
        
        const messagesWrapper = document.createElement('div');
        messagesWrapper.classList.add('messages__wrapper');
        messagesWrapper.append(videoEl)
        
        this.currentVideoMessage = document.createElement('li');
        this.currentVideoMessage.classList.add('messages__box');
        this.currentVideoMessage.append(messagesWrapper);
        
        this.messages.append(this.currentVideoMessage);
        videoEl.play();
    }


    createVideoMessage(coordinates, date, mediaSrc) {
        const lastMessage = this.messages.lastElementChild;
    
        const time = document.createElement('time');
        time.classList.add('messages__time');
        time.innerText = date;
        lastMessage.append(time);

        const messagesWrapper = lastMessage.getElementsByClassName('messages__wrapper').item(0);
        const messagesCoordinates = document.createElement('span');
        messagesCoordinates.classList.add('messages__coordinates');
        messagesCoordinates.innerText = `[${coordinates}]`;
        messagesWrapper.append(messagesCoordinates);
        
        const video = lastMessage.getElementsByClassName('video').item(0);
        video.srcObject = null
        video.src = mediaSrc;
    }

    createAudioElement(box, src, coordinates, date, mediaTeg) {
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

}
