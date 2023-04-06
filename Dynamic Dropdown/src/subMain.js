export function getLocalStorage() {
  return JSON.parse(localStorage.getItem('data')) || [];
}
export function setLocalStorage(data) {
  localStorage.setItem('data', JSON.stringify(data));
}

export function addAttribute(element, attribute, value) {
  element.setAttribute(attribute, value);
}
