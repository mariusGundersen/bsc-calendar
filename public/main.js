import {$, classes} from './lib.js';
import {time, emptyTime} from './components.js';
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

const table = document.querySelector("#ukeplan");

const days = Object.entries(weekplan)
  .map(([day, rooms]) => ({
    day,
    rooms: Object.entries(rooms).map(([name, plan]) => ({name, plan}))
  }))
  .filter(({rooms}) => rooms.length > 0);

const calculateWidth = days => 1 / days.map(d => d.rooms.length).reduce((a, b) => a + b, 0) * 100;

const renderDay = ({ day, rooms }) => html`<td colspan=${rooms.length} class="day">${day}</td>`;

const renderRoom = width => (room, i, e) => html`
  <td
    class=${`sal ${i === 0 ? 'first' : ''} ${i === e.length - 1 ? 'last' : ''}`}
    style=${{width: width+'%'}}>
      ${room.name}
  </td>
`;

const agera = action => (...args) => {
  action(...args);
  renderAll();
}

const renderLesson = (lesson, index) => html`
  <div>
    <label>Navn: <input oninput=${agera(e => lesson.name = e.target.value)} /></label>
    <select onchange=${agera(e => lesson.type = e.target.value)}>
      <option value="lindy">Lindy</option>
      <option value="balboa">Balboa</option>
      <option value="boogie">Boogie</option>
      <option value="jazz">Jazz</option>
      <option value="shag">Shag</option>
      <option value="blues">Blues</option>
      <option value="felles">Felles</option>
    </select>
    <label>Start: <input type="time" oninput=${agera(e => lesson.start = e.target.value)} /></label>
    <label>End: <input type="time" oninput=${agera(e => lesson.end = e.target.value)}/></label>
  </div>
`;

const lessons = [];
const hours = [];

for(var i=19*4; i<19*4+3*4+1; i++){
  hours.push(i);
}

const addLesson = agera(() => lessons.push({}));

const renderInput = () => render(input, () => html`
  ${lessons.map(renderLesson)}
  <button onclick=${addLesson}>Add</button>
`);

const renderOutput = () => render(table, () => html`
  <tr>
    <td>\xa0</td>
    ${days.map(renderDay)}
    <td>\xa0</td>
  </tr>
  <tr>
    <td class="sal">\xa0</td>
    ${days.flatMap(day => day.rooms.map(renderRoom(calculateWidth(days))))}
    <td class="sal">\xa0</td>
  </tr>
  ${hours.map(i => html`
    <tr class=${i-19*4}>
      ${time(i)}
      ${days
        .flatMap(day => day.rooms)
        .map(room => {
          const lesson = room.plan.find(x => x.start == i-19*4);
          if(lesson){
            return html`<td class=${lesson.class} rowspan=${lesson.length}>${lesson.title}</td>`;
          }else if(room.plan.find(x => x.start < i-19*4 && x.start+x.length > i-19*4)){
            //do nothing, there is something filling this room
          }else{
            return html`<td class=${i%4 == 0 ? 'empty hour' : 'empty'}>\xa0</td>`;
          }
        })
        .filter(x => x)
      }
      ${time(i)}
    </tr>
  `)}
`);

const renderAll = () => {
  renderInput();
  renderOutput();
}

renderAll();