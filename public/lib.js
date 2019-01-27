export function classes(...values){
  return values
    .flatMap(v => {
      if(v && typeof(v) === 'object'){
        return Object.entries(v)
          .filter(([k, v]) => v)
          .map(([k]) => k)
      }else{
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