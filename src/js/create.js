export default class Create {
    element(box, text, coordinates, date) {
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

}