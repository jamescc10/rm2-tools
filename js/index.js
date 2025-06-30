const loadingSVGElement = document.getElementById("loadingSVG");
const dataListElement = document.getElementById("dataList");
const dataNotPublicTextElement = document.getElementById("dataNotPublicText");
let isLoading = false;

const gameid = "1280770";

const lb = [
    "7278576", // deathsLB
    "7278567", // expLB
    "7278569", // ffaLossesLB
    "7278568", // ffaWinsLB
    "7278574", // killsLB
    "8917861", // kothLossesLB
    "8917858", // kothWinsLB
    "7605131", // meleeKillsLB
    "8046038", // noscopesLB
    "7278572", // tdmLossesLB
    "7278570", // tdmWinsLB
    "7278578", // worldDeaths
];

const lbName = [
    "Deaths",
    "Level",
    "Free for all losses",
    "Free for all wins",
    "Kills",
    "King of the hill losses",
    "King of the hill wins",
    "Melee kills",
    "No scopes",
    "Team deathmatch losses",
    "Team deathmatch wins",
    "World deaths",
];

const corsProxy = "https://corsproxy.io/?url=";

async function getDataOne(profileLink, lb) {
    const steamurl = `${profileLink}stats/${gameid}/achievements/?tab=leaderboards&lb=${lb}`;
    const url = corsProxy + steamurl;
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");
    const allA = html.querySelectorAll("a");
    let data = {};
    allA.forEach((element) => {
        const href = element.getAttribute("href");
        if(href) {
            if(href.startsWith(`${profileLink}stats/${gameid}/`)) {
                data.name = element.innerText;
                
                element.parentElement.parentElement.parentElement.childNodes.forEach((e) => {
                    if(e.nodeType == 1 && e.getAttribute("class")) {
                        if(e.getAttribute("class") == "scoreh") {
                            data.score = e.innerText.trim();
                        } else if(e.getAttribute("class") == "globalRankh") {
                            data.rank = e.innerText.trim().slice(13,e.innerText.trim().length);
                        }
                    }
                });
            }
        }
    });
    return data;
}

async function getData(profile) {
    let data = {};
    data.score = new Array();

    for(let i = 0; i < lb.length; ++i) {
        let d = undefined;

        d = await getDataOne(profile, lb[i]);

        if(d.name != undefined) {
            data.name = d.name;
            data.score.push([lbName[i], d.rank, d.score]);
        } else {
            data.score.push([lbName[i], "N/A", "N/A"]);
        }
    }

    return data;
}

async function submitButtonPress() {
    if(isLoading)
        return;

    isLoading = true;
    console.log("Loading...");
    dataListElement.innerHTML = "";
    loadingSVGElement.style.display = "block";
    dataListElement.style.display = "flex";
    dataNotPublicTextElement.style.display = "none";

    let profile = document.getElementById("steamIdInput").value;
    if(profile[profile.length-1] != "/")
        profile = profile.padEnd(profile.length+1, "/");

    const data = await getData(profile);

    if(await data.name == undefined) {
        console.log("Data is not public.");
        dataNotPublicTextElement.style.display = "block";
        loadingSVGElement.style.display = "none";
        dataListElement.style.display = "none";
        isLoading = false;
        return;
    } else {
        console.log(data);
    }

    data.score[1] = ["Level", data.score[1][1], Math.floor(Math.sqrt(Number(data.score[1][2].replace(/,/g, ""))/64))]; // EXP to Level

    loadingSVGElement.style.display = "none";
    dataListElement.innerHTML = `
    <span class='dataText semibold'>Name - ${data.name}</span>
    <span class='dataText semibold'>${data.score[4 ][0]} - ${data.score[4 ][1]} - ${data.score[4 ][2]}</span>
    <span class='dataText semibold'>${data.score[7 ][0]} - ${data.score[7 ][1]} - ${data.score[7 ][2]}</span>
    <span class='dataText semibold'>${data.score[8 ][0]} - ${data.score[8 ][1]} - ${data.score[8 ][2]}</span>
    <span class='dataText semibold'>${data.score[0 ][0]} - ${data.score[0 ][1]} - ${data.score[0 ][2]}</span>
    <span class='dataText semibold'>${data.score[11][0]} - ${data.score[11][1]} - ${data.score[11][2]}</span>
    <span class='dataText semibold'>${data.score[1 ][0]} - ${data.score[1 ][1]} - ${data.score[1 ][2]}</span>
    <span class='dataText semibold'>${data.score[3 ][0]} - ${data.score[3 ][1]} - ${data.score[3 ][2]}</span>
    <span class='dataText semibold'>${data.score[2 ][0]} - ${data.score[2 ][1]} - ${data.score[2 ][2]}</span>
    <span class='dataText semibold'>${data.score[6 ][0]} - ${data.score[6 ][1]} - ${data.score[6 ][2]}</span>
    <span class='dataText semibold'>${data.score[5 ][0]} - ${data.score[5 ][1]} - ${data.score[5 ][2]}</span>
    <span class='dataText semibold'>${data.score[10][0]} - ${data.score[10][1]} - ${data.score[10][2]}</span>
    <span class='dataText semibold'>${data.score[9 ][0]} - ${data.score[9 ][1]} - ${data.score[9 ][2]}</span>
    `;
    /*
    Kills - 4
    Melee kills - 7
    No scopes - 8
    Deaths - 0
    World deaths - 11
    EXP - 1
    Free for all wins - 3
    Free for all losses - 2
    King of the hill wins - 6
    King of the hill losses - 5
    Team deathmatch wins - 10
    Team deathmatch losses - 9
    */
   isLoading = false;
}

document.getElementById("submitButton").addEventListener("click", async () => {
    await submitButtonPress();
});

document.getElementById("steamIdInput").addEventListener("keydown", async (e) => {
    if(e.key == "Enter")
        await submitButtonPress();
});