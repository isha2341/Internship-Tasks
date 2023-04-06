// formData is accessible here as we have global variable in formData.js
import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId, secretKey) {
    // formContainerId, storageId, tableContainerId will be in argument of constructor
    // start code to init and link form.js, storage.js, table.js
    const frm = new Form(formContainerId, formData);
    // form js class to create form and access its methods
    const storage = new Storage(storageId, secretKey); // storage class to access storage methods
    const tbl = new Table(tableContainerId); // table js class to create table and access its methods
    frm.createform();
    frm.on('change', frm.valueChange.bind(frm));
    tbl.createPara(storage.getLocalStorage());
    frm.on('reset', frm.resetForm.bind(frm));
    const labels = frm.getLabels();
    tbl.createTable(labels);
    frm.on('submit', (data) => {
      // Object.entries(data).forEach(([key, value]) => {
      //   console.log(key, ':', value);
      // });
      const i = storage.addUpdateData(data);
      const item = this.ondisplay();
      const l = item.length - 1;
      const labelsNew = frm.getLabels();
      if (i === undefined) {
        tbl.addRows(item[l], labelsNew);
      } else {
        tbl.updateRow(i + 1, item[i], labelsNew);
      }
    });
    tbl.on('update', () => {
      const obj = tbl.getobj();
      frm.update(obj);
    });
    tbl.on('delete', () => {
      frm.resetForm();
      const id = tbl.getId();
      storage.remove(id);
      this.ondisplay();
    });
    this.ondisplay = () => {
      const item = storage.getLocalStorage();
      tbl.paraValue(item);
      if (item.length > 0) {
        tbl.table.setAttribute('style', 'display:table');
      } else {
        tbl.table.setAttribute('style', 'display:none');
      }
      return item;
    };
    window.onload = () => {
      const data = this.ondisplay();
      const labelsNew = frm.getLabels();
      data.forEach((item) => {
        tbl.addRows(item, labelsNew);
      });
    };
    // console.log(formData, frm, storage, tbl, 'Printed all instance of the class to remove eslint error');
  }
}
//formContainerId: HTML Div element id inside of which you want to create form4
// formContainerId -> #employeeForm of current index.html
// storageId: localStorage key for saving json  string data init
// storageId -> 'employeeData' simple string to selected as key of localStorage
//tableContainerId: HTML Div element id inside of which you want to create table
// tableContainerId -> #tableDiv of current index.html
//pass formContainerId, storageId, tableContainerId to Main(formContainerId, storageId, tableContainerId)
const main1 = new Main('employeeForm', 'employeeData', 'tableDiv', 'secretKey');
// const main2 = new Main('studentForm', 'studentData', 'studentDiv', 'secretKey');
// console.log(main);
