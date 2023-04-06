import { setLocalStorage, getLocalStorage, addAttribute } from './subMain.js';

let editId = '';
const dateOfBirth = document.getElementById('dob');
const nme = document.getElementById('name');
const mail = document.getElementById('email');
const phoneNo = document.getElementById('phoneNo');
const frm = document.getElementById('myForm');

const today = new Date();
const date = today.getDate();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const year = today.getFullYear();
document.getElementById('dob').max = `${year}-${month}-${date}`;

frm.onsubmit = function display(event) {
  event.preventDefault();
  // const name = nme.value;
  // const dob = dateOfBirth.value;
  // const email = mail.value;
  // const phone = phoneNo.value;
  //radio button gender
  const radioButtonGroup = document.getElementsByName('gender');
  const checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
  // const gender = checkedRadio.value;
  //checkbox hobby
  const markedCheckbox = document.getElementsByName('hobby');
  const hobby = [];
  for (const checkbox of markedCheckbox) {
    if (checkbox.checked) {
      hobby.push(checkbox.value);
    }
  }
  const obj = {
    name: nme.value,
    gender: checkedRadio.value,
    dob: dateOfBirth.value,
    email: mail.value,
    phone: phoneNo.value,
    hby: hobby.toString(),
    id: Date.now(),
  };

  if (editId.length == 0) {
    addData(obj);
  } else {
    edit(obj);
  }
  loadStorage();
  frm.reset();
};

function addData(obj) {
  const formData = getLocalStorage();
  formData.push(obj);
  setLocalStorage(formData);
}

window.onload = function () {
  loadStorage();
};

function update(index) {
  const data = getLocalStorage();
  console.log(data[index].id);
  editId = data[index].id;
  nme.value = data[index].name;
  mail.value = data[index].email;
  phoneNo.value = data[index].phone;
  dateOfBirth.value = data[index].dob;
  if (data[index].gender == 'Male') {
    document.getElementById('male').checked = true;
  } else {
    document.getElementById('female').checked = true;
  }
  const temp = data[index].hby;
  const hobby = temp.split(',');
  for (const x of hobby) {
    if (x == 'Dancing') {
      document.getElementById('dance').checked = true;
    } else if (x == 'Singing') {
      document.getElementById('sing').checked = true;
    } else if (x == 'Traveling') {
      document.getElementById('travel').checked = true;
    }
  }
}

frm.onreset = function rst() {
  editId = '';
};

function edit(obj) {
  const data = getLocalStorage();

  const updatedData = data.map((d) => {
    if (d.id === editId) {
      d = obj;
    }
    return d;
  });
  setLocalStorage(updatedData);

  // for (let i = 0; i < data.length; i++) {
  //   if (data[i].id == editId) {
  //     data[i] = obj;
  //     setLocalStorage(data);
  //   }
  // }

  editId = '';
}

function remove(index) {
  const data = getLocalStorage();
  data.splice(index, 1);
  setLocalStorage(data);
  loadStorage();
  frm.reset();
}

function loadStorage() {
  const data = getLocalStorage();
  if (!data.length) {
    document.getElementById('conDisplay').style.display = 'none';
  } else {
    document.getElementById('conDisplay').style.display = 'block';
  }
  const tbl = document.getElementById('table');

  tbl.rows.forEach((e, i) => {
    if (i !== 0) {
      tbl.deleteRow(i);
    }
  });

  // for (let i = 1; i < tbl.rows.length; ) {
  //   tbl.deleteRow(i);
  // }

  const tblBody = document.createElement('tbody');
  tblBody.setAttribute('id', 'tableBody');
  console.log(data, localStorage.getItem('data'));
  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');
    for (const prop in data[i]) {
      const cell = document.createElement('td');
      const cellText = document.createTextNode(data[i][prop]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    const editButton = document.createElement('input');
    addAttribute(editButton, 'type', 'button');

    editButton.setAttribute('value', 'Edit');
    // editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    editButton.setAttribute('style', 'color: green;');
    const removeButton = document.createElement('input');
    removeButton.setAttribute('type', 'button');
    removeButton.setAttribute('value', 'x');
    removeButton.setAttribute('style', 'color: red;');
    row.deleteCell(-1);
    const cell1 = document.createElement('td');
    cell1.appendChild(editButton);
    row.appendChild(cell1);
    editButton.addEventListener('click', () => update(i));
    const cell2 = document.createElement('td');
    cell2.appendChild(removeButton);
    row.appendChild(cell2);
    removeButton.addEventListener('click', () => remove(i));
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
}
