exports.saveUserToUserList = function saveUserToUserList(user, list) {
	list.push(user);
};

exports.removeUserFromList = function removeUserFromList(currentUser, list) {
	if (list === undefined) {
		return;
	} else if (list.length > 0) {
		const newArray = array.filter(function (user) {
			return user !== currentUser;
		});
		return newArray;
	}
};

exports.createUsername = function createUsername(username) {
	const cleanUsername = removeSymbols(username);
	if (cleanUsername === null || cleanUsername === "" || cleanUsername === undefined) {
		return "Anonymous";
	} else {
		return cleanUsername;
	}
};

exports.createUniqueUser = function createUniqueUser(username, userList) {
	return addNumberToStringFromArray(username, userList);
};

function removeSymbols(string) {
	return string.replace(/[\/%\^"'&\?\*\(\)\[\]{}\+=$ _`~!@\#<,>\.\:\;]/g, "");
}

// Add number to string based on array length
function addNumberToStringFromArray(string, array) {
	return string + "#" + (array.length + 1);
}