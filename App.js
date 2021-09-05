import { Tag } from './Tag.js'
import {TimeZone} from './TimeZone.js'

export class App extends Tag {
    msg = 'Hello World';
    render() {
        return this.html`<h1 @click=${this.onClicked.bind(this)} >${this.msg}</h1>`
    }
    onClicked(){
        TimeZone.search();
    }
}
Tag.register('eo-app', App);