import {$, createComment} from './lib.js';
import {html} from 'https://unpkg.com/lighterhtml?module'

export const emptyTime = (classes='') => html`<td class=${classes}>\xa0</td>`;

export const time = i => i % 4 == 0
  ? html`<td class="time hour">${i/4}:00</td>`
  : html`<td class="time">\xa0</td>`;