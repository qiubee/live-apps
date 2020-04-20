const axios = require("axios");

// getJourney(4671);

function travel(req, res) {
	res.render("travel", {
		title: "Reisinformatie"
	});
}

async function getJourney(ritnummer) {
	const stops = getStops(ritnummer);
	const vehicleInfo = await getVehicleInformation(ritnummer);
	console.log("Vehicle information: ", vehicleInfo);
	const allStations = await getAllStations();
	const stationCodes = await getStationCodes(allStations, stops);
	console.log("Station codes: ", stationCodes);
}

function getStops(ritnummer) {
	const route = Number(String(ritnummer).substring(0,2));
	switch (route) {
	case 46: 
		return ["Den Haag Centraal", "Leiden Centraal", "Schiphol Airport", "Amsterdam Sloterdijk", "Amsterdam Centraal"];
	}
}

async function getStationCodes(stations, stops) {
	return await stations.filter(function (station) {
		for (const stop of stops) {
			if (station.namen.lang === stop) {
				return true;
			}
		}
	}).map(function (station) {
		return station.code;
	});
}

async function getVehicleInformation(ritnummer) {
	const allVehicles = await getAllVehicleInformation();
	return allVehicles.treinen.filter(function (vehicle) {
		return vehicle.treinNummer === ritnummer;
	});
}

async function getAllVehicleInformation() {
	return await fetchFromNSApi("https://gateway.apiportal.ns.nl/virtual-train-api/api/vehicle", process.env.NS_API_KEY);
}

async function getAllStations() {
	return await fetchFromNSApi("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations", process.env.NS_API_KEY);
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