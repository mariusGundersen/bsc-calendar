import { groupBy, getHours, updateLesson, undoRedo } from './lib.js';
import {
  time,
  selectType,
  selectDay,
  selectTime,
  renderDays,
  renderRooms,
  renderRow
} from './components.js';
import { render, html } from 'https://unpkg.com/lighterhtml?module';
import { createStore, combineReducers } from 'https://unpkg.com/redux@4.0.4/es/redux.js?module';
import plan from './plan.js';

const inputElm = document.querySelector('#input');
const weekplanElm = document.querySelector("#ukeplan");

const action = {
  updateLesson(lesson, key, value) {
    return {
      type: 'updateLesson',
      lesson,
      key,
      value
    };
  },
  removeLesson(lesson) {
    return {
      type: 'removeLesson',
      lesson
    }
  },
  addLesson() {
    return {
      type: 'addLesson',
      lesson: {
        name: '',
        type: 'felles',
        room: 'Sal 1',
        day: 'Mandag',
        start: '19:00',
        end: '20:30'
      }
    }
  },
  setSortKey(key) {
    return {
      type: 'setSortKey',
      key
    }
  }
}

const store = createStore(combineReducers({
  lessons: undoRedo((lessons = [], action) => {
    switch (action.type) {
      case 'updateLesson':
        return updateLesson(
          lessons,
          action);
      case 'removeLesson':
        return lessons.filter(lesson => lesson !== action.lesson);
      case 'addLesson':
        return [...lessons, action.lesson];
      case 'init':
        return action.lessons;
      default:
        return lessons;
    }
  }),
  sort: (state = { key: 'name', dir: -1 }, action) => {
    switch (action.type) {
      case 'setSortKey':
        return {
          key: action.key,
          dir: state.key === action.key ? -state.dir : state.dir
        };
      default:
        return state;
    }
  }
}));

let rendering = false;
store.subscribe(() => {
  if (!rendering) {
    rendering = true;
    requestAnimationFrame(() => {
      rendering = false;
      const state = store.getState();
      renderAll(state, store.dispatch);
      localStorage.setItem('lessonPlan', JSON.stringify(state.lessons.current));
    });
  }
});

const by = (key, dir) => (a, b) => a[key] < b[key] ? dir : a[key] > b[key] ? -dir : 0;

const renderLesson = (lesson, dispatch) => html`
  <tr>
    <td>
      <input type="checkbox" checked=${lesson.enabled} onchange=${dispatch(e => action.updateLesson(lesson, 'enabled', e.target.checked))} />
    </td>
    <td>
      <input value=${lesson.name} oninput=${dispatch(e => action.updateLesson(lesson, 'name', e.target.value))} />
    </td>
    <td>
      ${selectType(lesson.type, dispatch(type => action.updateLesson(lesson, 'type', type)))}
    </td>
    <td>
      ${selectDay(lesson.day, dispatch(day => action.updateLesson(lesson, 'day', day)))}
    </td>
    <td>
      <input value=${lesson.room} oninput=${dispatch(e => action.updateLesson(lesson, 'room', e.target.value))} />
    </td>
    <td>
      ${selectTime(lesson.start, dispatch(time => action.updateLesson(lesson, 'start', time)))}
    </td>
    <td>
      ${selectTime(lesson.end, dispatch(time => action.updateLesson(lesson, 'end', time)))}
    </td>
    <td><button type="button" onclick=${dispatch(() => action.removeLesson(lesson))} class="remove">Fjern</button></td>
  </tr>
`;

const dayNames = [
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag'
];

const renderInput = (lessons, sort, dispatch) => html`
  <table class="input">
    <tr>
      <th onclick=${dispatch(() => action.setSortKey('enabled'))}>Ja?</th>
      <th onclick=${dispatch(() => action.setSortKey('name'))}>Navn</th>
      <th onclick=${dispatch(() => action.setSortKey('type'))}>Type</th>
      <th onclick=${dispatch(() => action.setSortKey('day'))}>Ukedag</th>
      <th onclick=${dispatch(() => action.setSortKey('room'))}>Sal</th>
      <th onclick=${dispatch(() => action.setSortKey('start'))}>Fra</th>
      <th onclick=${dispatch(() => action.setSortKey('end'))}>Til</th>
      <th></th>
    </tr>
    ${lessons.current.sort(by(sort.key, sort.dir)).map(lesson => renderLesson(lesson, dispatch))}
  </table>
  <button onclick=${dispatch(() => action.addLesson())}>Legg til ny time</button>
  <button onclick=${dispatch(() => ({ type: 'undo' }))} disabled=${!lessons.canUndo}>Undo</button>
  <button onclick=${dispatch(() => ({ type: 'redo' }))} disabled=${!lessons.canRedo}>Redo</button>
`;

const renderWeekplan = lessons => {
  const activeLessons = lessons.filter(l => l.enabled);

  if (activeLessons.length == 0) {
    return html``;
  }

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

  return html`
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
  `;
};

const renderAll = (state, dispatch) => {
  render(inputElm, () => renderInput(state.lessons, state.sort, action => e => dispatch(action(e))));
  render(weekplanElm, () => renderWeekplan(state.lessons.current));
}

store.dispatch({ type: 'init', lessons: JSON.parse(localStorage.getItem('lessonPlan') || 'false') || plan });
