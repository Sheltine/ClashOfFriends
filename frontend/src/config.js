require('dotenv/config');

console.log(`ici : ${process.env.REACT_APP_BACKEND_URL}`);

module.exports = {
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
};
