
function getRandomValueFromZero(max) {
    return Math.floor(Math.random() * max);
}

function getRandomValueFromMin(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getRandomValueFromZero, getRandomValueFromMin };
