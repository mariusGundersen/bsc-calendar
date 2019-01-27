import {$, classes, groupBy} from './lib.js';
import {
  time,
  emptyTime,
  renderDays,
  renderRooms
} from './components.js';
import {render, html, svg} from 'https://unpkg.com/lighterhtml?module'

const weekplan = {
  "Mandag": {
    "Sal 3": [
      {
        title: "Balboa 2",
        class: "balboa",
        start: 4,
        length: 6
      },
      {
        title: "Balboa Sosialdans",
        class: "balboa",
        start: 10,
        length: 2
      }
    ],
    "Sal 5": [
      {
        title: "Balboa 1",
        class: "balboa",
        start: 4,
        length: 6
      },

    ]
  },
  "Tirsdag": {
    "Sal 1": [
      {
        title: "Lindy 3",
        class: "lindy",
        start: 0,
        length: 6
      },
      {
        title: "Sosialdans",
        class: "felles",
        start: 6,
        length: 6
      }
    ],
    "Sal 3": [
      {
        title: "Balboa egentrening",
        class: "balboa",
        start: 0,
        length: 6
      },
      {
        title: "Sosialdans",
        class: "felles",
        start: 6,
        length: 6
      }
    ],
    "Sal 6": [
      {
        title: "Boogie 2",
        class: "boogie",
        start: 1,
        length: 5
      }
    ],
    "Bårdar 2": [
      {
        title: "Lindy 2",
        class: "lindy",
        start: 0,
        length: 6
      }
    ],
    "BLS": [
      {
        title: "Lindy 1",
        class: "lindy",
        start: 0,
        length: 6
      },
      {
        title: "Sosialdans",
        class: "felles",
        start: 6,
        length: 6
      }
    ],
  },
  "Onsdag": {
    "Sal 3": [
      {
        title: "Balboa 3",
        class: "balboa",
        start: 6,
        length: 6
      }
    ],
    "Sal 5": [
      {
        title: "Jazz 4 / Jazz 2",
        class: "jazz",
        start: 0,
        length: 6
      },
      {
        title: "Shag 1",
        class: "shag",
        start: 6,
        length: 6
      }
    ],
    "Sal 6": [
      {
        title: "Åpen egentrening",
        class: "felles",
        start: 2,
        length: 6
      }
    ],
    "Sal 7": [
      {
        title: "Blues",
        class: "blues",
        start: 0,
        length: 6
      }
    ],
  },
  "Torsdag": {
    "Sal 3": [
      {
        title: "Boogie 4",
        class: "boogie",
        start: 0,
        length: 6
      },
      {
        title: "Shag 3",
        class: "shag",
        start: 6,
        length: 6
      }
    ],
    "Sal 5": [
      {
        title: "Boogie 3",
        class: "boogie",
        start: 2,
        length: 6
      }
    ],
    "Sal 6": [
      {
        title: "Lindy egentrening med instruktør",
        class: "lindy",
        start: 6,
        length: 6
      }
    ],
    "Sal 7": [
      {
        title: "Jazz 1",
        class: "jazz",
        start: 0,
        length: 6
      }
    ],
    "Bårdar 2": [
      {
        title: "Lindy 4",
        class: "lindy",
        start: 0,
        length: 6
      }
    ],
  }
};

const input = document.querySelector('#input');

let agering = false;
const agera = action => (...args) => {
  action(...args);
  if(!agering){
    agering = true;
    requestAnimationFrame(() => {
      agering = false;
      renderAll();
      localStorage.setItem('lessonPlan', JSON.stringify(lessons));
    });
  }
}

const renderLesson = (lesson, index) => html`
  <div>
    <label>Navn: <input value=${lesson.name} oninput=${agera(e => lesson.name = e.target.value)} /></label>
    <select value=${lesson.type} onchange=${agera(e => lesson.type = e.target.value)}>
      <option value="lindy">Lindy</option>
      <option value="balboa">Balboa</option>
      <option value="boogie">Boogie</option>
      <option value="jazz">Jazz</option>
      <option value="shag">Shag</option>
      <option value="blues">Blues</option>
      <option value="felles">Felles</option>
    </select>
    <select value=${lesson.day} onchange=${agera(e => lesson.day = e.target.value)}>
      <option value="Mandag">Mandag</option>
      <option value="Tirsdag">Tirsdag</option>
      <option value="Onsdag">Onsdag</option>
      <option value="Torsdag">Torsdag</option>
      <option value="Fredag">Fredag</option>
      <option value="Lørdag">Lørdag</option>
      <option value="Søndag">Søndag</option>
    </select>
    <label>Sal: <input value=${lesson.room} oninput=${agera(e => lesson.room = e.target.value)} /></label>
    <label class="time-input">Start: <input type="text" pattern="\d\d:\d\d" placeholder="hh:mm" value=${lesson.start} oninput=${agera(e => lesson.start = e.target.value)} /></label>
    <label class="time-input">End: <input type="text" pattern="\d\d:\d\d" placeholder="hh:mm" value=${lesson.end} oninput=${agera(e => lesson.end = e.target.value)}/></label>
    <button type="button" onclick=${agera(() => lessons.splice(index, 1))} class="remove">Fjern</button>
  </div>
`;

const lessons = JSON.parse(localStorage.getItem('lessonPlan') || '[]') || [];
const hours = [];
const dayNames = [
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag'
];

for(var i=19*4; i<19*4+3*4+1; i++){
  hours.push(`${(i/4)|0}:${String((i%4)*15).padStart(2, '0')}`);
}

const addLesson = agera(() => lessons.push({
  name: '',
  type: 'felles',
  room: 'Sal 1',
  day: 'Mandag',
  start: '19:00',
  end: '20:30'
}));

const renderInput = () => render(input, () => html`
  ${lessons.map(renderLesson)}
  <button onclick=${addLesson}>Add</button>
`);

const table = document.querySelector("#ukeplan");

const renderOutput = () => {

  const days = dayNames.map(name => ({
    name,
    rooms: groupBy(lessons.filter(l => l.day == name), l => l.room)
      .map(([name, plan]) => ({
        name,
        plan
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })).filter(x => x.rooms.length > 0);

  const calculateWidth = days => 1 / days.map(d => d.rooms.length).reduce((a, b) => a + b, 0) * 100;

  render(table, () => html`
    <tbody>
      ${renderDays(days)}
      ${renderRooms(days, calculateWidth(days))}
      ${hours.map(hour => html`
        <tr>
          ${time(hour)}
          ${days
            .flatMap(day => day.rooms
            .map((room, i) => {
              const lesson = room.plan.find(x => x.start == hour);
              if(lesson){
                return html`<td class=${lesson.type} rowspan=${findLength(hours, lesson.start, lesson.end)}>${lesson.name}</td>`;
              }else if(room.plan.find(x => x.start < hour && x.end > hour)){
                //do nothing, there is something filling this room
              }else{
                return html`<td class=${classes('empty', {'hour': hour.includes(':00'), 'first': i == 0})}>\xa0</td>`;
              }
            }))
            .filter(x => x)
          }
          ${time(hour)}
        </tr>
      `)}
    </tbody>
  `);
};

const renderAll = () => {
  renderInput();
  renderOutput();
}

const findLength = (hours, start, end) => {
  for(let a = hours.indexOf(start), i=a; i < hours.length; i++){
    if(hours[i] == end){
      return i - a;
    }
  }
}

renderAll();
