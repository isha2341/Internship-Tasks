// imports
import JSON from "./data.js";

// selectors
const scope = document.querySelector("body");
document.onclick = hideMenu;
document.oncontextmenu = rightClick;
const menuElementDisplay = document.getElementById("customMenu");

hideMenu();

//globals
document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    hideMenu();
  }
});

menuElementDisplay.addEventListener("click", (e) => {
  e.stopPropagation();
});

function hideMenu() {
  menuElementDisplay.style.display = "none";
}

function parseMenu(container, json) {
  const menu = document.createElement("ul");
  container.appendChild(menu);
  json.forEach((list) => {
    const li = document.createElement("li");
    li.setAttribute("style", "list-style:none;");
    li.setAttribute("id", `item`);
    li.setAttribute("class", list.label);
    if ("separator" in list) {
      const separator = document.createElement("hr");
      li.appendChild(separator);
      separator.setAttribute("style", "border: 2px solid #bfbbbb;");
    }

    if ("label" && "icon" in list) {
      const newIcon = document.createElement("i");
      newIcon.setAttribute("class", list.icon);
      newIcon.setAttribute("id", "menuIcon");
      const newlabel = document.createElement("Label");
      newlabel.innerHTML = list.label;
      li.appendChild(newIcon);
      li.appendChild(newlabel);
      if (list.items) {
        const newIcon = document.createElement("i");
        newIcon.setAttribute("class", "pi pi-fw pi-angle-right");
        newIcon.setAttribute("id", "arrowIcon");
        li.append(newIcon);
        let div = document.createElement("div");
        div.setAttribute("id", "subMenu");
        parseMenu(div, list.items);
        li.appendChild(div);
        div.setAttribute("style", "visibility:hidden;");
        li.addEventListener("mouseover", () => {
          div.setAttribute("style", "visibility:visible;");
        });
        li.addEventListener("mouseout", () => {
          div.setAttribute("style", "visibility:hidden;");
        });
      }
      if ("command" in list) {
        li.addEventListener("click", list.command);
      }
    }
    menu.appendChild(li);
  });
}

const img = document.createElement("img");
img.src = "image.jpg";
img.setAttribute("width", "auto");
img.setAttribute("height", "400px");
const body = document.getElementsByTagName("body")[0];
body.appendChild(img);

const container = document.getElementById("customMenu");
parseMenu(container, JSON);

function rightClick(e) {
  e.preventDefault();
  if (menuElementDisplay.style.display === "block") {
    hideMenu();
  } else {
    menuElementDisplay.style.display = "block";
    // menuElementDisplay.style.left = e.pageX + "px";
    // menuElementDisplay.style.top = e.pageY + "px";
    const contextMenu = document.querySelector("#customMenu");
    const shareMenu = contextMenu.querySelector("#subMenu");
    let x = e.offsetX,
      y = e.offsetY,
      winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      cmWidth = contextMenu.offsetWidth,
      cmHeight = contextMenu.offsetHeight;
    // console.log("window inner width: ", winWidth);
    // console.log("context menu width: ", cmWidth);
    // console.log("share menu width: ", shareMenu.offsetWidth);
    // console.log("x : ", x);
    if (x > winWidth - cmWidth - shareMenu.offsetWidth) {
      shareMenu.style.left = "100px";
    } else if (x === winWidth) {
      shareMenu.style.right = "100%";
    } else {
      shareMenu.style.left = "";
      shareMenu.style.right = "100px";
    }
    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.visibility = "visible";
  }
}
