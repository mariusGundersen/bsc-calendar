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
