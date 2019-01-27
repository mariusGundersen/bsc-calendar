import {html} from 'https://unpkg.com/lighterhtml?module'

export const emptyTime = (classes='') => html`<td class=${classes}>\xa0</td>`;

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

export const renderDay = ({ name, rooms }) => html`<td colspan=${rooms.length} class="day">${name}</td>`;