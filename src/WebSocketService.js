export default class WebSocketService extends EventTarget {
    constructor(address) {
        super()
        this.address = address
    }

    open() {
        this.ws = new WebSocket("ws://" + this.address);

        this.ws.onopen = () => {
            console.log('Websocket opened')
        };

        this.ws.onmessage = (event) => {
            let parsed = JSON.parse(event.data)
            this.dispatchEvent(new CustomEvent(parsed['responseType'], { detail: parsed['data'] }));
        }
            
        this.ws.onclose = () => {
            console.log('Websocket closed')
        }
    }

    send(command, args = {}) {
        this.ws.send(JSON.stringify({command, args}))
    }
}