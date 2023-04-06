export function getLocalStorage() {
  console.log('call received at get');
  return JSON.parse(localStorage.getItem('data')) || [];
}
export function setLocalStorage(data) {
  console.log('call received at set');
  localStorage.setItem('data', JSON.stringify(data));
}

export function addAttribute(element, attribute, value) {
  element.setAttribute(attribute, value);
}
