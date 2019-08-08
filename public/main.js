import { groupBy, getHours } from './lib.js';
import {
  time,
  renderDays,
  renderRooms,
  renderRow
} from './components.js';
import { render, html } from 'https://unpkg.com/lighterhtml?module'
import plan from './plan.js';

const input = document.querySelector('#input');

let agering = false;
const agera = action => (...args) => {
  action(...args);
  if (!agering) {
    agering = true;
    requestAnimationFrame(() => {
      agering = false;
      renderAll();
      localStorage.setItem('lessonPlan', JSON.stringify(lessons));
    });
  }
}

const by = (key, dir) => (a, b) => a[key] < b[key] ? dir : a[key] > b[key] ? -dir : 0;

const renderLesson = (lesson, index) => html`
  <tr>
    <td><input type="checkbox" checked=${lesson.enabled} onchange=${agera(e => lesson.enabled = !lesson.enabled)} /></td>
    <td><input value=${lesson.name} oninput=${agera(e => lesson.name = e.target.value)} /></td>
    <td><select value=${lesson.type} onchange=${agera(e => lesson.type = e.target.value)}>
      <option value="lindy">Lindy</option>
      <option value="balboa">Balboa</option>
      <option value="boogie">Boogie</option>
      <option value="jazz">Jazz</option>
      <option value="shag">Shag</option>
      <option value="blues">Blues</option>
      <option value="felles">Felles</option>
    </select></td>
    <td><select value=${lesson.day} onchange=${agera(e => lesson.day = e.target.value)}>
      <option value="Mandag">Mandag</option>
      <option value="Tirsdag">Tirsdag</option>
      <option value="Onsdag">Onsdag</option>
      <option value="Torsdag">Torsdag</option>
      <option value="Fredag">Fredag</option>
      <option value="Lørdag">Lørdag</option>
      <option value="Søndag">Søndag</option>
    </select></td>
    <td><input value=${lesson.room} oninput=${agera(e => lesson.room = e.target.value)} /></td>
    <td><input type="text" pattern="^\\d\\d:\\d\\d$" placeholder="hh:mm" value=${lesson.start} oninput=${agera(e => lesson.start = e.target.value)} /></td>
    <td><input type="text" pattern="^\\d\\d:\\d\\d$" placeholder="hh:mm" value=${lesson.end} oninput=${agera(e => lesson.end = e.target.value)}/></td>
    <td><button type="button" onclick=${agera(() => lessons.splice(index, 1))} class="remove">Fjern</button></td>
  </tr>
`;

const lessons = JSON.parse(localStorage.getItem('lessonPlan') || 'false') || plan;
const dayNames = [
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag'
];


const addLesson = agera(() => lessons.push({
  name: '',
  type: 'felles',
  room: 'Sal 1',
  day: 'Mandag',
  start: '19:00',
  end: '20:30'
}));

let sortKey = 'day';
let sortDir = -1;

const renderInput = () => render(input, () => html`
  <table class="input">
    <tr>
      <th onclick=${setSortKey('enabled')}>Ja?</th>
      <th onclick=${setSortKey('name')}>Navn</th>
      <th onclick=${setSortKey('type')}>Type</th>
      <th onclick=${setSortKey('day')}>Ukedag</th>
      <th onclick=${setSortKey('room')}>Sal</th>
      <th onclick=${setSortKey('start')}>Fra</th>
      <th onclick=${setSortKey('end')}>Til</th>
      <th></th>
    </tr>
    ${lessons.sort(by(sortKey, sortDir)).map(renderLesson)}
  </table>
  <button onclick=${addLesson}>Legg til ny time</button>
`);

const setSortKey = key => agera(e => {
  if (key == sortKey) {
    sortDir *= -1;
  } else {
    sortKey = key
  }
});

const weekplanElm = document.querySelector("#ukeplan");

const renderWeekplan = () => {
  const activeLessons = lessons.filter(l => l.enabled);
  const days = dayNames.map(name => ({
    name,
    rooms: groupBy(activeLessons.filter(l => l.day == name), l => l.room)
      .map(([name, plan]) => ({
        name,
        plan
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })).filter(x => x.rooms.length > 0);

  const calculateWidth = days => 1 / days.map(d => d.rooms.length).reduce((a, b) => a + b, 0) * 100;
  const hours = getHours(activeLessons.flatMap(l => [l.start, l.end]));

  render(weekplanElm, () => html`
    <tbody>
      ${renderDays(days)}
      ${renderRooms(days, calculateWidth(days))}
      ${hours.map(hour => html`
        <tr>
          ${time(hour)}
          ${renderRow(hour, days, hours)}
          ${time(hour)}
        </tr>
      `)}
    </tbody>
  `);
};

const renderAll = () => {
  renderInput();
  renderWeekplan();
}


renderAll();
