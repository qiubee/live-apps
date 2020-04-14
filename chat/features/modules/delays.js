exports.shortDelay = async function shortDelay() {
	return await new Promise (function (res, rej) {
		setTimeout(function () {
			res();
		}, 200);
	});
};

exports.longDelay = async function longDelay() {
	return await new Promise (function (res, rej) {
		setTimeout(function () {
			res();
		}, 1250);
	});
};