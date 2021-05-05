export default class Create {
    element(box, text, latitude, longitude, date) {
        box.insertAdjacentHTML('beforeend', `
            <li class="messages__box">
                <div>
                    <p class="messages__text">${text}</p>
                    <span class="messages__coordinates">[${latitude}, ${longitude}]</span>
                </div>
                <time class="messages__time">${date}</time>   
            </li>
        `);
    }

}