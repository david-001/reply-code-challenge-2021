// Need to install Node.js
// To run code. Type node reply.js in terminal

// Strategy
// Sort by building and antenna with highest connection speed

file_name = "data_scenarios_a_example.in";
// file_name = "data_scenarios_b_mumbai.in";
// file_name = "data_scenarios_c_metropolis.in";
// file_name = "data_scenarios_d_polynesia.in";
// file_name = "data_scenarios_e_sanfrancisco.in";
// file_name = "data_scenarios_f_tokyo.in";

const fs = require("fs");
let input_raw = "";

// Read in raw text
try {
  input_raw = fs.readFileSync(file_name, { encoding: "utf8", flag: "r" });
} catch (err) {
  console.error(err);
}

input_raw = input_raw.split("\n");
console.log(input_raw);

let input_arr = [];
let input_row = "";

// Convert string to array of numbers
for (let i = 0; i < input_raw.length; i++) {
  input_row = input_raw[i].split(" ");
  if (input_row.length > 1) {
    input_arr.push([]);
    for (let j = 0; j < input_row.length; j++) {
      input_arr[i].push(parseInt(input_row[j], 10));
    }
  }
}

const grid_width = input_arr[0][0];
const grid_height = input_arr[0][1];
const no_buildings = input_arr[1][0];
const no_antennas = input_arr[1][1];
const buildings = [];
let buildings_conn_speed = [];
// Get Building data
for (let i = 0; i < no_buildings; i++) {
  buildings.push(input_arr[2 + i]);
  buildings_conn_speed.push(input_arr[2 + i][3]);
}

const antennas = [];
let antennas_left = [];
let ants_conn_speed = [];
// Get Antenna data
for (let i = 0; i < no_antennas; i++) {
  antennas.push(input_arr[2 + no_buildings + i]);
  antennas_left.push(i);
  ants_conn_speed.push(input_arr[2 + no_buildings + i][1]);
}

// find building using connection speed
// buildings are identified using x,y coordinates
const findBuilding = (building_conn_speed) => {
  let sel_building = [];
  for (let i = 0; i < buildings.length; i++) {
    if (buildings[i][3] === building_conn_speed) {
      sel_building = buildings[i];
      buildings.splice(i, 1);
      return sel_building;
    }
  }
};

// find antenna using connection speed
// antennas_left = array containing the indexes of antennas left
const findAntenna = (ant_conn_speed, antennas_left) => {
  for (let i = 0; i < antennas_left.length; i++) {
    if (antennas[antennas_left[i]][1] === ant_conn_speed) {
      return antennas_left[i];
    }
  }
};

// find maximum
const findMax = (arr) => {
  let maxNum = -9999;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maxNum) {
      maxNum = arr[i];
    }
  }
  return maxNum;
};

// Set amount of antennas
let added_antennas = [];
if (no_antennas <= no_buildings) {
  added_antennas.push([no_antennas]);
} else {
  added_antennas.push([no_buildings]);
}

// Main logic to find best antenna location
let added_antenna = -1;
let added_building = [];
while (antennas_left.length > 0) {
  // find max building connection speed
  // select building with highest connection speed
  let max_building_conn_speed = findMax(buildings_conn_speed);
  added_building = findBuilding(max_building_conn_speed);

  // find max antenna connection speed
  // select antenna with highest connection speed
  let max_ant_conn_speed = findMax(ants_conn_speed);
  added_antenna = findAntenna(max_ant_conn_speed, antennas_left);

  // remove selected building from list
  buildings_conn_speed.splice(
    buildings_conn_speed.indexOf(max_building_conn_speed),
    1
  );
  // remove selected antennas from list
  ants_conn_speed.splice(ants_conn_speed.indexOf(max_ant_conn_speed), 1);
  antennas_left.splice(antennas_left.indexOf(added_antenna), 1);

  // add selected antenna and building to array
  added_antennas.push([added_antenna, added_building[0], added_building[1]]);
}

// Prepare array to be written as text
let added_antennas_tmp = [];
for (let i = 0; i < added_antennas.length; i++) {
  added_antennas_tmp.push(added_antennas[i].join(" "));
}
const content = added_antennas_tmp.join("\n");
// console.log(content);

// Write to text file -Name of file "result.txt"
try {
  fs.writeFileSync("result.txt", content);
  // file written successfully
} catch (err) {
  console.error(err);
}
