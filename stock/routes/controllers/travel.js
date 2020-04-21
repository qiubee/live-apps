const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const NSapiKey = process.env.NS_API_KEY;

// getJourney(4669);

function travel(req, res) {
	res.render("travel", {
		title: "Reisinformatie"
	});
}

async function getJourney(voyageNumber) {
	const stopCodes = getStops(voyageNumber);
	console.log("Station codes: ", stopCodes);
	const vehicleInfo = await getVehicleInformation(voyageNumber);
	console.log("Vehicle information: ", vehicleInfo);
	const vehicleSchedule = await getVehicleSchedule(voyageNumber, stopCodes);
	console.log("Vehicle Schedule: ", vehicleSchedule);
}

async function getVehicleSchedule(voyageNumber, vehicleStopCodes) {
	const allStations = await getAllStations(NSapiKey);
	const schedule = await Promise.all(vehicleStopCodes.map(async function (stationCode) {
		const stationTimes = await getArrivalsAtStation(NSapiKey, stationCode);
		const arrival = stationTimes.arrivals.filter(function (arrival) {
			console.log(arrival.product.number, String(voyageNumber), arrival.product.number === String(voyageNumber));
			return arrival.product.number === String(voyageNumber);
		});
		const stationData = {
			code: stationCode,
			names: getStationNames(allStations)
		};
		const schedule = arrival.map(function (arrivalTimes) {
			arrivalTimes.station = stationData;
			return arrivalTimes;
		});
		return schedule;
	}));
	return schedule;
}

function getStops(voyageNumber) {
	const route = Number(String(voyageNumber).substring(0,2));
	switch (route) {
	case 46: 
		const stops = ["ASD", "ASS", "ASDL", "SHL", "HFD", "NVP", "SSH", "LEDN", "DVNK", "VST", "GVM", "LAA", "GVC"];
		return reverseArrayWhenNumberIsOdd(voyageNumber, stops);
	}
}

function reverseArrayWhenNumberIsOdd(num, arr) {
	// Test whether a value is odd or even: https://stackoverflow.com/questions/6211613/testing-whether-a-value-is-odd-or-even
	if (Math.abs(num % 2) == 1) {
		return arr.reverse();
	} else {
		return arr;
	}
}

function getStationCodes(allStations, vehicleStops) {
	return allStations.filter(function (station) {
		for (const stop of vehicleStops) {
			if (station.namen.lang === stop) {
				return true;
			}
		}
	}).map(function (station) {
		return station.code;
	});
}

function getStationNames(allStations, stationCode) {
	return allStations.filter(function (station) {
		return station.code === stationCode;
	}).map(function (station) {
		console.log(station);
		return station.namen;
	});
}

async function getVehicleInformation(voyageNumber) {
	const allVehicles = await getAllVehicleInformation(NSapiKey);
	return allVehicles.treinen.filter(function (vehicle) {
		return vehicle.treinNummer === voyageNumber;
	});
}

async function getAllVehicleInformation(apiKey) {
	return await fetchFromNSApi("https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle", apiKey);
}

async function getAllStations(apiKey) {
	return await fetchFromNSApi("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations", apiKey);
}

async function getArrivalsAtStation(apiKey, stationCode) {
	const station = "&station=" + stationCode;
	const maxJourneys = "?maxJourneys=" + 25;
	const lang = "&lang=nl";
	const url = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals" + maxJourneys + lang + station;
	const data = await fetchFromNSApi(url, apiKey);
	return data;
}

async function fetchFromNSApi(url, apiKey) {
	try {
		const res = await axios.get(url, { headers: {
			"Ocp-Apim-Subscription-Key": apiKey
		}});
		if (res.status === 200) {
			return res.data.payload;			
		}
	} catch (err) {
		console.error(err);
	}
}

module.exports = travel;