// Utility file that contains nonspecific useful functions

var getNamesFromArrayFunc = function (array) {
	return array.length > 0 ? array.reduce((acc, cur) => acc + cur.name + " ", "") : "None";
}

function isVowel(x) {

	var result;

	result = x.toUpperCase() === "A" || x === "E" || x === "I" || x === "O" || x === "U";
	return result;
}

var indefArticleFunc = function (str) {
	return (isVowel(str.charAt(0)) ? "an " : "a ") + str;
}

module.exports = {

	// Takes an array and returns a string containing each "name" property from each element with a space inbetween
	getNamesFromArray: getNamesFromArrayFunc,

	// Takes a string and returns the string with an appropriate indefinite article preceding it
	addIndefArticle: indefArticleFunc
}