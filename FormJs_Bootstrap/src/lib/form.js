export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId);
    //this.labelList = {};
    this.labelList = [];
    this.obj = {};
    //Container element from HTML in which you have to add form Pass formContainerId to append form element inside of HTML DIV element use formData to create form
    this.formData = formData;
    // this.arr = [];
    const _events = {};
    this.on = function (name, callback) {
      if (!_events[name]) {
        _events[name] = [callback];
      } else {
        _events[name].push(callback);
      }
      if (name === 'submit') {
        this.container.onsubmit = (event) => {
          event.preventDefault();
          this.sendArr();
          _events[name].forEach((value) => value(this.getArr()));
        };
      } else if (name === 'change') {
        this.container.onchange = () => {
          _events[name].forEach((value) => value());
        };
      } else if (name === 'reset') {
        this.container.onreset = () => {
          _events[name].forEach((value) => value());
        };
      }
    };
    // console.log('Form', formData);
  } // create methods/event to create form/ reset form/ submit form, etc
  resetForm() {
    this.container.reset();
    this.obj = {};
  }
  update(obj) {
    this.obj = obj;
    const elements = this.container.elements;
    for (let i = 0; i < elements.length; i++) {
      const x = elements.item(i).getAttribute('type');
      const y = elements.item(i).getAttribute('label');
      if (y === 'Gender') {
        if (elements.item(i).value == obj[elements.item(i).getAttribute('key')]) {
          elements.item(i).checked = true;
        }
      } else if (y === 'Hobbies') {
        if (obj[elements.item(i).getAttribute('key')].includes(elements.item(i).value) == true) {
          elements.item(i).checked = true;
        } else {
          elements.item(i).checked = false;
        }
      } else if (!(x === 'reset' || x === 'submit' || x === 'radio' || x === 'checkbox')) {
        elements.item(i).value = obj[elements.item(i).getAttribute('key')];
      }
    }
  }
  sendArr() {
    this.newobj = {};
    this.formData.forEach((data) => {
      if (data.type === 'hidden') {
        this.newobj[data.key] = data.getValue(this.obj);
      }
    });
    this.valueChange();
    this.object = { ...this.newobj, ...this.obj };
    console.log('Form Submit : ', this.object);
    this.obj = {};
    this.container.reset();
  }

  getArr() {
    return this.object;
  }

  getLabels() {
    return this.labelList;
  }

  valueChange() {
    const elements = this.container.elements;
    const hby = [];
    for (let i = 0; i < elements.length; i++) {
      const x = elements.item(i).getAttribute('label');
      const y = elements.item(i).getAttribute('type');
      if (x === 'Gender') {
        if (elements.item(i).checked) {
          this.obj[elements.item(i).getAttribute('key')] = elements.item(i).value;
        }
      } else if (x === 'Hobbies') {
        if (elements.item(i).checked) {
          hby.push(elements.item(i).value);
          this.obj[elements.item(i).getAttribute('key')] = hby;
        } else {
          hby.push();
          this.obj[elements.item(i).getAttribute('key')] = hby;
        }
      } else if (!(y === 'reset' || y === 'submit' || y === 'radio' || y === 'checkbox')) {
        this.obj[elements.item(i).getAttribute('key')] = elements.item(i).value;
      }
    }
    // console.log(this.obj);
  }

  createform() {
    this.formData.forEach((element) => {
      if (element.label) {
        //this.labelList[element.key] = element.label;
        this.labelList.push({
          key: element.key,
          label: element.label,
        });
      }
      if (element.type != 'hidden') {
        if (element.label) {
          const label = addLabel(element, this.container);
          label.setAttribute('style', 'font-weight:550');
        }
        if (element.type === 'select') {
          this[element.key] = document.createElement('select');
          element.options.forEach((item) => {
            const opt = document.createElement('option');
            opt.setAttribute('value', item.value);
            opt.innerHTML = item.innerText; //item[0].toUpperCase() + item.slice(1);
            this[element.key].appendChild(opt);
          });
          if (element.attr) {
            this.attribute(this[element.key], element.attr);
          }
          this[element.key].setAttribute('value', element.value);
          this[element.key].setAttribute('key', element.key);
          this[element.key].setAttribute('label', element.label);
          this.container.append(this[element.key]);
        } else if (element.type === 'radio' || element.type === 'checkbox') {
          element.options.forEach((item) => {
            lineBreak(this.container);
            this[element.key] = this.input(element, this.container);
            if (item.attr) {
              this.attribute(this[element.key], item.attr);
            }
            this[element.key].setAttribute('value', item.value);
            this[element.key].setAttribute('name', item.name);
            const label = addLabel(item, this.container);
            label.innerHTML = item.innerText;
            label.setAttribute('for', item.attr.id);
          });
        } else if (element.type === 'textarea') {
          this[element.key] = document.createElement('textarea');
          if (element.attr) {
            this.attribute(this[element.key], element.attr);
          }
          this[element.key].setAttribute('value', element.value);
          this[element.key].innerHTML = element.value;
          this[element.key].setAttribute('key', element.key);
          this[element.key].setAttribute('label', element.label);
          this.container.appendChild(this[element.key]);
        } else {
          this.input(element, this.container);
        }
        lineBreak(this.container);
      }
    });
  }

  attribute(element, attrObj) {
    Object.entries(attrObj).forEach(([key, value]) => {
      if (typeof value === 'function') {
        element.setAttribute(key, value);
        if (key === 'onchange') {
          element.onchange = (e) => {
            value(e);
          };
        } else if (key === 'onclick') {
          element.onclick = (e) => {
            value(e);
          };
        } else if (key === 'onfocus') {
          element.onfocus = (e) => {
            value(e);
          };
        }
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  input(element, container) {
    if (!(element.type === 'submit' || element.type === 'reset' || element.type === 'hidden')) {
      this[element.key] = document.createElement('input');
      this[element.key].setAttribute('type', element.type);
      this[element.key].setAttribute('key', element.key);
      this[element.key].setAttribute('label', element.label);
      this[element.key].setAttribute('value', element.value);
      if (element.attr) {
        this.attribute(this[element.key], element.attr);
      }
      container.appendChild(this[element.key]);
      return this[element.key];
    } else {
      this[element.type] = document.createElement('input');
      this[element.type].setAttribute('type', element.type);
      if (element.attr) {
        this.attribute(this[element.type], element.attr);
      }
      container.appendChild(this[element.type]);
      return this[element.type];
    }
  }
}

function addLabel(element, container) {
  const label = document.createElement('label');
  label.innerHTML = element.label;
  container.appendChild(label);
  return label;
}

function lineBreak(container) {
  const br = document.createElement('br');
  container.appendChild(br);
}
