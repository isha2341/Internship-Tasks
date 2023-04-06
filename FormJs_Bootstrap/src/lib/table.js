export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId); // Use this container to create table inside of it
    // Pass tableContainerId to append table inside of HTML DIV element
    // console.log('Table');
    let id;
    let obj = {};
    this.table = document.createElement('table');

    const _events = {};
    this.on = function (name, callback) {
      if (!_events[name]) {
        _events[name] = [callback];
      } else {
        _events[name].push(callback);
      }
    };

    this.addRows = (data, labels) => {
      // for (let i = 1; i < this.table.rows.length; ) {
      //   this.table.deleteRow(i);
      // }
      console.log('Table Add :', data);
      // objArr.forEach((data) => {
      const row = document.createElement('tr');
      // Object.entries(data).forEach(([key, value]) => {
      //   const cell = document.createElement('td');
      //   cell.setAttribute('id', key);
      //   const cellText = document.createTextNode(value);
      //   cell.appendChild(cellText);
      //   row.appendChild(cell);
      // });
      //Object.entries(labels).forEach(([key, value]) => {
      labels.forEach((header) => {
        const cell = document.createElement('td');
        cell.setAttribute('id', header.key);
        const cellText = document.createTextNode(data[header.key]);
        cell.appendChild(cellText);
        row.appendChild(cell);
      });
      const cell1 = document.createElement('td');
      const buttons = ['update', 'delete'];
      buttons.forEach((btn) => {
        const button = document.createElement('input');
        button.setAttribute('type', 'button');
        const string = btn.charAt(0).toUpperCase() + btn.slice(1);
        button.setAttribute('value', string);
        button.setAttribute('id', btn);
        cell1.appendChild(button);
        if (btn === 'update') {
          button.onclick = () => {
            id = data.userId;
            obj = data;
            _events['update'].forEach((value) => value());
          };
        } else if (btn === 'delete') {
          button.onclick = () => {
            id = data.userId;
            _events['delete'].forEach((value) => value());
            this.table.removeChild(row);
          };
        }
      });
      row.appendChild(cell1);
      this.table.appendChild(row);
      // });
    };

    this.updateRow = (i, object, labels) => {
      console.log('Table Update :', object);
      let index = 0;
      const x = this.table.rows[i].cells;
      labels.forEach((header) => {
        // const cell = document.createElement('td');
        // cell.setAttribute('id', header.key);
        // const cellText = document.createTextNode(data[header.key]);
        // cell.appendChild(cellText);
        // row.appendChild(cell);
        x[index].innerHTML = object[header.key];
        index++;
      });
      // Object.keys(object).forEach((key) => {
      //   x[index].innerHTML = object[key];
      //   index++;
      // });
    };
    this.getId = () => {
      return id;
    };

    this.getobj = () => {
      return obj;
    };
    // console.log('Form', formData);
  }

  createPara(data) {
    this.para = document.createElement('p');
    const text = document.createTextNode('Total Items : ');
    this.val = document.createTextNode(data.length);
    this.para.appendChild(text);
    this.para.appendChild(this.val);
    this.container.appendChild(this.para);
  }

  paraValue(data) {
    this.val.nodeValue = data.length;
  }

  createTable(labels) {
    const row = document.createElement('tr');
    // Object.entries(labels).forEach(([key, value]) => {
    //   // labels.forEach((header) => {
    //   const cell = document.createElement('th');
    //   cell.setAttribute('id', key);
    //   const cellText = document.createTextNode(value);
    //   cell.appendChild(cellText);
    //   row.appendChild(cell);
    // });
    labels.forEach((header) => {
      const cell = document.createElement('th');
      cell.setAttribute('id', header.key);
      const cellText = document.createTextNode(header.label);
      cell.appendChild(cellText);
      row.appendChild(cell);
    });
    const cell = document.createElement('th');
    const cellText = document.createTextNode('Action');
    cell.appendChild(cellText);
    row.appendChild(cell);
    this.table.appendChild(row);
    this.container.appendChild(this.table);
  }

  // create methods/event to refresh table data, add data row, update data row, delete data row, etc
}
