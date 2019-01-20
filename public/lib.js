export function $(tagName, attributes, ...children){
  const elm = document.createElement(tagName);
  for(const [key, val] of Object.entries(attributes || {})){
    elm.setAttribute(key, val);
  }
  for(const child of children){
    if(typeof child === "string"){
      elm.textContent = child;
    }else if(child){
      elm.appendChild(child);
    }
  }
  return elm;
}

export function createComment(content){
  return document.createComment(content);
}

export function classes(...values){
  return values
    .flatMap(v => {
      if(v && typeof(v) === 'object'){
        Object.entries(v)
          .filter(([k, v]) => v)
          .map(([k]) => k)
      }else{
        return [v];
      }
    })
    .filter(v => v)
    .join(' ');
}