import {$, createComment} from './lib.js';
import {html} from 'https://unpkg.com/lighterhtml?module'

export const emptyTime = (classes='') => html`<td class=${classes}>\xa0</td>`;

export const time = hour => hour.includes(':00')
  ? html`<td class="time hour">${hour}</td>`
  : html`<td class="time">\xa0</td>`;


export const renderRooms = (rooms, width) => html`
  <tr>
    <td class="sal">\xa0</td>
    ${rooms.map(renderRoom(width))}
    <td class="sal">\xa0</td>
  </tr>
`;

export const renderRoom = width => (room, i, e) => html`
  <td
    class=${`sal ${i === 0 ? 'first' : ''} ${i === e.length - 1 ? 'last' : ''}`}
    style=${{width: width+'%'}}>
      ${room.name}
  </td>
`;

export const renderDays = days => html`
  <tr>
    <td>\xa0</td>
    ${days.map(renderDay)}
    <td>\xa0</td>
  </tr>
`;

export const renderDay = ({ day, rooms }) => html`<td colspan=${rooms.length} class="day">${day}</td>`;