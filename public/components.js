import { html } from 'https://unpkg.com/lighterhtml?module'
import { classes } from './lib.js';

export const emptyTime = (classes = '') => html`<td class=${classes}>\xa0</td>`;

export const time = hour => hour.includes(':00')
  ? html`<td class="time hour">${hour}</td>`
  : html`<td class="time">\xa0</td>`;

export const selectType = (type, onChange) => html`
  <select value=${type} onchange=${e => onChange(e.target.value)}>
    <option value="lindy">Lindy</option>
    <option value="balboa">Balboa</option>
    <option value="boogie">Boogie</option>
    <option value="jazz">Jazz</option>
    <option value="shag">Shag</option>
    <option value="blues">Blues</option>
    <option value="felles">Felles</option>
  </select>
`;

export const selectDay = (day, onChange) => html`
  <select value=${day} onchange=${e => onChange(e.target.value)}>
    <option value="Mandag">Mandag</option>
    <option value="Tirsdag">Tirsdag</option>
    <option value="Onsdag">Onsdag</option>
    <option value="Torsdag">Torsdag</option>
    <option value="Fredag">Fredag</option>
    <option value="Lørdag">Lørdag</option>
    <option value="Søndag">Søndag</option>
  </select>
`;

export const selectTime = (time, onChange) => html`
  <select value=${time} onchange=${e => onChange(e.target.value)}>
  <option value="18:00">18:00</option>
  <option value="18:15">18:15</option>
  <option value="18:30">18:30</option>
  <option value="18:45">18:45</option>
  <option value="19:00">19:00</option>
  <option value="19:15">19:15</option>
  <option value="19:30">19:30</option>
  <option value="19:45">19:45</option>
  <option value="20:00">20:00</option>
  <option value="20:15">20:15</option>
  <option value="20:30">20:30</option>
  <option value="20:45">20:45</option>
  <option value="21:00">21:00</option>
  <option value="21:15">21:15</option>
  <option value="21:30">21:30</option>
  <option value="21:45">21:45</option>
  <option value="22:00">22:00</option>
  <option value="22:15">22:15</option>
  <option value="22:30">22:30</option>
  <option value="22:45">22:45</option>
  </select>
`;

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
