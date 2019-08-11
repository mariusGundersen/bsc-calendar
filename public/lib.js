export function classes(...values) {
  return values
    .flatMap(v => {
      if (v && typeof (v) === 'object') {
        return Object.entries(v)
          .filter(([k, v]) => v)
          .map(([k]) => k)
      } else {
        return [v];
      }
    })
    .filter(v => v)
    .join(' ');
}

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return [...map.entries()];
}

export function getHours(times) {
  const first = times.sort((a, b) => a.localeCompare(b))[0].split(':');
  const last = times.sort((a, b) => b.localeCompare(a))[0].split(':');

  const from = first[0] * 4 + first[1] / 15;
  const to = last[0] * 4 + last[1] / 15;

  const hours = [];

  for (var i = from; i <= to; i++) {
    hours.push(`${(i / 4) | 0}:${String((i % 4) * 15).padStart(2, '0')}`);
  }

  return hours;
}

export function updateLesson(lessons, action) {
  return lessons.map(lesson => lesson === action.lesson
    ? ({
      ...lesson,
      [action.key]: action.value
    })
    : lesson);
}

export function undoRedo(reducer, historyLength = 20) {
  return (state = { history: [], index: 0, canUndo: false, canUndo: false }, action) => {
    switch (action.type) {
      case 'undo':
        if (state.canUndo) {
          return {
            current: state.history[state.index + 1],
            history: state.history,
            index: state.index + 1,
            canUndo: state.index + 2 < state.history.length,
            canRedo: true,
          };
        } else {
          return state;
        }
      case 'redo':
        if (state.canRedo) {
          return {
            current: state.history[state.index - 1],
            history: state.history,
            index: state.index - 1,
            canUndo: true,
            canRedo: state.index - 1 > 0
          };
        } else {
          return state;
        }
      default:
        const current = reducer(state.current, action);

        if (current === state.current) {
          return state;
        }

        return {
          current,
          history: [current, ...state.history.filter((_, i) => i >= state.index && i < historyLength)],
          index: 0,
          canUndo: true,
          canRedo: false
        };
    }
  }
}
