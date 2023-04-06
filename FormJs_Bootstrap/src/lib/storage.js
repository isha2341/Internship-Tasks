/* eslint-disable no-undef */
export default class Storage {
  constructor(storageId, key) {
    this.storageId = storageId; // use this.storageId with localStorage as a unique key to store data
    // Pass storageId to save json string data after each operation in localStorage
    // local storageId is important to retrieve old saved data
    // console.log('Storage');
    const _events = {};
    this.on = function (name, callback) {
      if (!_events[name]) {
        _events[name] = [callback];
      } else {
        _events[name].push(callback);
      }
    };

    this.secret = key;
    this.addUpdateData = (obj) => {
      const data = this.getLocalStorage();
      const i = data.findIndex((e) => e.userId === obj.userId);
      if (i > -1) {
        if (name === 'updateData') {
          _events[name].forEach((value) => value());
        }
        this.update(obj);
        return i;
      } else {
        this.addData(obj);
        if (name === 'addData') {
          _events[name].forEach((value) => value());
        }
      }
    };
  }

  encryptedValue(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secret).toString();
  }

  decryptedValue(data) {
    const bytes = CryptoJS.AES.decrypt(data, this.secret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  setLocalStorage(data) {
    const encryptedData = this.encryptedValue(data);
    localStorage.setItem(this.storageId, encryptedData);
  }

  addData(obj) {
    const data = this.getLocalStorage();
    data.push(obj);
    this.setLocalStorage(data);
  }

  remove(xyz) {
    const data = this.getLocalStorage();
    const i = data.findIndex((e) => e.userId === xyz);
    data.splice(i, 1);
    this.setLocalStorage(data);
  }

  update(obj) {
    const data = this.getLocalStorage();
    const i = data.findIndex((e) => e.userId === obj.userId);
    data.splice(i, 1, obj);
    this.setLocalStorage(data);
  }

  getLocalStorage() {
    let mainData = [];
    if (this.storageId in localStorage) {
      const temp = localStorage.getItem(this.storageId);
      const decryptArray = this.decryptedValue(temp);
      mainData = decryptArray;
    }
    return mainData;
  }
  // create methods to perform operations like save/edit/delete/add data
}
