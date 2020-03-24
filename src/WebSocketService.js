export default class WebSocketService extends EventTarget {
    constructor(address) {
        super()
        this.address = address
    }

    open() {
        this.ws = new WebSocket("ws://" + this.address);

        this.ws.onopen = () => {
            console.log('Websocket opened')
            this.dispatchEvent(new CustomEvent('opened'));
        };

        this.ws.onmessage = (event) => {
            let parsed = JSON.parse(event.data)
            this.dispatchEvent(new CustomEvent(parsed['responseType'], { detail: parsed['data'] }));
        }

        this.ws.onclose = () => {
            console.log('Websocket closed')
            setTimeout(this.open.bind(this), 1000)
        }
    }

    send(command, args = {}) {
        if (this.ws.readyState) {
            this.ws.send(JSON.stringify({command, args}))
        }
    }
}