require('dotenv/config');

console.log(`ici : ${process.env.REACT_APP_BACKEND_URL}`);

module.exports = {
    BACKEND_URL: 'http://localhost:4000',
};
