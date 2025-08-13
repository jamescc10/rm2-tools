let currentWeapon = 1;
let currentLoadout = 0;
let data = [
    {one: "Rifle", two: "Shotgun", three: "Sniper"},
    {one: "SMG", two: "Revolver", three: "None"}
];

const dataError = document.getElementById("dataError");
const dataName = document.getElementById("dataName");
const dataOne = document.getElementById("dataOne");
const dataTwo = document.getElementById("dataTwo");
const dataThree = document.getElementById("dataThree");
const list = document.getElementById("listList");
const dialog = document.getElementById("selWeapon");
const dialogCopy = document.getElementById("copyDialog");

function error(msg) {
    dataError.style.display = "block";
    dataError.innerHTML = `<hr>${msg}`;
}

function noErrors() {
    dataError.style.display = "none";
}

function loadData(number) {
    noErrors();
    const d = data[number];
    if(d === undefined) {
        error("data doesnt exist");
    } else if(d.one == "None" && d.two == "None" && d.three == "None") {
        error("theres no data so it wont be loaded in game")
    }
    console.log(data[number]);
    dataName.innerHTML = `Loadout ${number+1}`;
    dataOne.innerHTML = `Weapon 1 - ${data[number].one}`;
    dataTwo.innerHTML = `Weapon 2 - ${data[number].two}`;
    dataThree.innerHTML = `Weapon 3 - ${data[number].three}`;
    currentLoadout = number;
}

function addListElement(number) {
    const element = document.createElement("span");
    element.innerHTML = `Loadout ${number+1}<br>`;
    element.onclick = () => {
        loadData(number);
    }
    list.appendChild(element);
}

function selectedWeapon(number) {
    currentWeapon = number;
    dialog.showModal();
}

function selectWeapon(weapon) {
    data[currentLoadout][currentWeapon] = weapon;
    dialog.close();
    loadData(currentLoadout);
}

function closeDialog() {
    dialog.close();
    dialogCopy.close();
}

function create() {
    const n = data.push({
        one: "None",
        two: "None",
        three: "None"
    });
    console.log(n);
    addListElement(n-1);
}

function copy() {
    const numberLoadout = Number(prompt("Which loadout?"))-1;
    const count = Number(prompt("How many times?"));
    const loadout = data[numberLoadout];

    for(let i = 0; i < count; ++i) {
        const n = data.push(loadout);
        addListElement(n-1);
    }

    console.log(loadout);
    console.log(count);
}

function ex() {
    let output = {
        "loadouts": [],
        "selectedLoadoutIndex": 1
    }

    for(let i = 0; i < data.length; ++i) {
        let loadout = {
            "name": "",
            "itemSlots": [
                {
                     "item": (data[i].one == "None") ? null : {"itemId": data[i].one}
                },
                {
                     "item": (data[i].two == "None") ? null : {"itemId": data[i].two}
                },
                {
                    "item": (data[i].three == "None") ? null : {"itemId": data[i].three}
                }
            ]
        };
        if(i != 0)
            loadout.name = null;

        output.loadouts.push(loadout);
    }
    console.log(output);

    const jsonString = JSON.stringify(output, null, 2);
    const blob = new Blob([jsonString], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loadouts.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

addListElement(0);
addListElement(1);
loadData(0);