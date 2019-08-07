import { html } from 'https://unpkg.com/lighterhtml?module'
import { classes } from './lib.js';

export const emptyTime = (classes = '') => html`<td class=${classes}>\xa0</td>`;

export const time = hour => hour.includes(':00')
  ? html`<td class="time hour">${hour}</td>`
  : html`<td class="time">\xa0</td>`;


export const renderRooms = (days, width) => html`
  <tr>
    <td class="sal">\xa0</td>
    ${days.flatMap(day => day.rooms.map(renderRoom(width)))}
    <td class="sal">\xa0</td>
  </tr>
`;

export const renderRoom = width => (room, i, e) => html`
  <td
    class=${`sal ${i === 0 ? 'first' : ''} ${i === e.length - 1 ? 'last' : ''}`}
    style=${{ width: width + '%' }}>
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

export const renderDay = ({ name, rooms }) => html`<td colspan=${rooms.length} class="day">${name}</td>`;

export const renderRow = (hour, days, hours) => days
  .flatMap(day => day.rooms
    .map((room, i) => {
      const lesson = room.plan.find(x => x.start == hour);
      if (lesson) {
        return html`<td class=${lesson.type} rowspan=${findLength(hours, lesson.start, lesson.end)}>${lesson.name}</td>`;
      } else if (room.plan.find(x => x.start < hour && x.end > hour)) {
        //do nothing, there is something filling this room
      } else {
        return html`<td class=${classes('empty', { 'hour': hour.includes(':00'), 'first': i == 0 })}>\xa0</td>`;
      }
    }))
  .filter(x => x);

const findLength = (hours, start, end) => {
  for (let a = hours.indexOf(start), i = a; i < hours.length; i++) {
    if (hours[i] == end) {
      return i - a;
    }
  }
}
