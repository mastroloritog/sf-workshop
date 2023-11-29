const axios = require("axios");

// const x = process.argv[2]
// const y = process.argv[3]

const team = "truck";
const password = "gerryScotti";

const root = `http://10.131.0.14:8080`;

const sleep = async(ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const main = async() => {
    //await signUp();
    await findTreasure();
    // res = await dig(45, 13);
    // console.log(res);
}

const signUp = async() => {
    const url = root + `/signup?team=${team}&password=${password}`;
    let data
    try {
        const res = await axios.get(url);
        data = res.data
    } catch (err) {
        data = err.response.data
    }
    console.log(data);
}

const dig = async(x, y) => {
    const url = root + `/dig?team=${team}&password=${password}&x=${x}&y=${y}`;
    let data
    try {
        const res = await axios.get(url);
        data = res.data
    } catch (err) {
        data = err.response.data
    }
    return data;
}

const getMap = async() => {
    const url = root + "/map";
    let data
    try {
        const res = await axios.get(url);
        data = res.data
    } catch (err) {
        data = err.response.data
    }
    return data;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const miniSearch = async(vcRadius) => {
    for(var i=0; i<vcRadius.length; i++) {
        console.log("Esplorando x:" + vcRadius[i].dx + ";y:" + vcRadius[i].dy);
        var distanceCode2 = await dig(vcRadius[i].dx, vcRadius[i].dy);
        var map = await getMap();
        if(distanceCode2.code == "TREASURE_FOUND" && !map[vcRadius[i].dx][vcRadius[i].dy].dug) {
            foundSomething = false;
            break;
        }
        await sleep(3000);
    }
}

const findTreasure = async() => {
    var foundSomething = false;
    var x, y;
    var distanceCode;
    while(true) {
        if(!foundSomething) {
            x = getRandomInt(50);
            y = getRandomInt(50);
        }
        var map = await getMap();
        if(!map[x][y].dug) {  // scavo nella casella se non è già stata scavata
            distanceCode = await dig(x, y);
            console.log("Esplorando x:" + x + ";y:" + y);
            console.log(distanceCode.code);
            switch(distanceCode.code) {
                case "CLOSE":{
                    foundSomething = false;

                    //x = getRandomInt(5) - 2;  // da -2 a 2
                    //y = getRandomInt(5) - 2;  // da -2 a 2
                    break;}
                case "VERY_CLOSE":{
                    foundSomething = true;
                    const vcRadius = [
                        {dx: x-1, dy: y-1},
                        {dx: x, dy: y-1},
                        {dx: x+1, dy: y-1},
                        {dx: x+1, dy: y},
                        {dx: x+1, dy: y+1},
                        {dx: x, dy: y+1},
                        {dx: x-1, dy: y+1},
                        {dx: x-1, dy: y},

                        {dx: x-2, dy: y-2},
                        {dx: x-1, dy: y-2},
                        {dx: x, dy: y-2},
                        {dx: x+1, dy: y-2},
                        {dx: x+2, dy: y-2},
                        {dx: x+2, dy: y-1},
                        {dx: x+2, dy: y},
                        {dx: x+2, dy: y+1},
                        {dx: x+2, dy: y+2},
                        {dx: x+1, dy: y+2},
                        {dx: x, dy: y+2},
                        {dx: x-1, dy: y+2},
                        {dx: x-2, dy: y+2},
                        {dx: x-2, dy: y+1},
                        {dx: x-2, dy: y},
                        {dx: x-2, dy: y-1},
                    ];
                    console.log("Caselle da esplorare: ");
                    for(var j=0; j<vcRadius.length; j++) {
                        console.log("{" + vcRadius[j].dx + ", " + vcRadius[j].dy + "}");
                    }
                    await miniSearch(vcRadius);
                    break;}
                case "FAR_AWAY":{
                    foundSomething = false;
                    break;}
            }
        }
        else {
            console.log("x:" + x + ";y:" + y + "; Casella già esplorata.")
        }

        await sleep(3000);

        
    }
}

main();