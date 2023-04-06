import { getLocalStorage, setLocalStorage, addAttribute } from './subMain.js';
const inputs = ['text', 'date', 'datetime-local', 'number', 'color', 'range', 'email', 'submit'];

const card = document.getElementById('card');

const heading = document.createElement('h2');
heading.innerHTML = 'Dynamically adding element inside the form';

const input = document.createElement('div');
addAttribute(input, 'id', 'input');

const form = document.createElement('form');
addAttribute(form, 'id', 'inputForm');

const uniqueId = document.createElement('input');
addAttribute(uniqueId, 'id', 'uniqueId');
addAttribute(uniqueId, 'type', 'text');
addAttribute(uniqueId, 'placeholder', 'Enter unique ID');
uniqueId.required = true;

const selectedInput = document.createElement('select');
addAttribute(selectedInput, 'id', 'inputType');
inputs.forEach(createOption);
function createOption(item) {
  const opt = document.createElement('option');
  addAttribute(opt, 'value', item);
  opt.innerHTML = item[0].toUpperCase() + item.slice(1);
  selectedInput.appendChild(opt);
}

const add = document.createElement('button');
addAttribute(add, 'type', 'submit');
addAttribute(add, 'value', 'submit');
addAttribute(add, 'id', 'add');
add.innerHTML = 'Add';

const refresh = document.createElement('button');
addAttribute(refresh, 'type', 'reset');
addAttribute(refresh, 'value', 'reset');
refresh.innerHTML = 'Refresh';

const output = document.createElement('div');
addAttribute(output, 'id', 'output');

input.appendChild(heading);
form.appendChild(uniqueId);
form.appendChild(selectedInput);
form.appendChild(add);
form.appendChild(refresh);
input.appendChild(form);
card.appendChild(input);
card.appendChild(output);

form.onreset = function rst() {
  const data = getLocalStorage();
  data.forEach(update);
};

function update(item, index) {
  var y = document.getElementById(`record${index}`);
  var x = document.getElementById(`input${index}`);
  if (item.inputValue != undefined) {
    x.value = item.inputValue;
  } else {
    y.reset();
  }
}

form.onsubmit = function display(event) {
  event.preventDefault();
  const data = getLocalStorage();
  if (data.find((e) => e.id === uniqueId.value)) {
    const alert = document.createElement('p');
    const msg = '*ID is not unique';
    document.body.appendChild(alert);
    setTimeout(function () {
      alert.innerHTML = '';
    }, 5000);
    alert.innerHTML = msg;
    form.reset();
    return;
  }
  const obj = { id: uniqueId.value, inputType: selectedInput.value };
  data.push(obj);
  setLocalStorage(data);
  loadData();
  form.reset();
};

function loadData() {
  const data = getLocalStorage();
  const index = data.length - 1;
  recordFunction(data[index], index);
}

function recordFunction(record, index) {
  const div = document.createElement('form');
  addAttribute(div, 'id', `record${index}`);
  addAttribute(div, 'style', 'margin-top:10px');
  const Text = document.createElement('span');
  addAttribute(Text, 'id', `text${index}`);
  Text.innerHTML = record.id;
  div.appendChild(Text);
  const inp = document.createElement('input');
  addAttribute(inp, 'id', `input${index}`);
  addAttribute(inp, 'type', record.inputType);
  inp.required = true;
  if (record.inputType === 'submit') {
    inp.addEventListener('click', () => {
      console.log('btn clicked');
    });
  }
  if (record.inputValue) {
    addAttribute(inp, 'value', record.inputValue);
  }
  div.appendChild(inp);
  const save = document.createElement('button');
  // // addAttribute(save, 'type', 'submit');
  div.onsubmit = () => saveData(event, record);
  // // save.addEventListener('click', () => saveData(record, index));
  addAttribute(save, 'id', 'save');
  save.innerHTML = 'Save';
  div.appendChild(save);
  const remove = document.createElement('button');
  remove.addEventListener('click', () => removeData(record));
  addAttribute(remove, 'id', 'remove');
  remove.innerHTML = 'Remove';
  div.appendChild(remove);
  output.appendChild(div);
}

window.onload = function () {
  const data = getLocalStorage();
  if (data.length > 0) {
    data.forEach(recordFunction);
  }
};

function saveData(e, record) {
  e.preventDefault();
  const localData = getLocalStorage();
  const i = localData.findIndex((x) => x.id === record.id);
  const inp = document.getElementById(`input${i}`);
  record.inputValue = inp.value;
  if (i > -1) {
    localData.splice(i, 1, record);
  } else {
    localData.push(record);
  }
  setLocalStorage(localData);
}

function removeData(record) {
  const localData = getLocalStorage();
  const i = localData.findIndex((e) => e.id === record.id);
  localData.splice(i, 1);
  setLocalStorage(localData);
  if (localData.length === 0) {
    localStorage.clear();
  }
  var elem = document.getElementById(`record${i}`);
  return elem.parentNode.removeChild(elem);
}
