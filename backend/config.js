require('dotenv/config');

module.exports = {
    DB_PARAMS: {
        replica1: process.env.MONGO_DB_REPLICA_1,
        replica2: process.env.MONGO_DB_REPLICA_2,
        replica3: process.env.MONGO_DB_REPLICA_3,
        user: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PWD,
        port: process.env.MONGO_DB_PORT || 27017,
        replicaSet: process.env.MONGO_DB_REPLICA_SET,
        dbName: process.env.MONGO_DB_NAME,
    },
    jwtOptions: {
        secret: process.env.JWT_SECRET,
    },
    SALT: process.env.SALT,
    BIRTHDATE_FORMAT: 'DD/MM/YYYY',
    DATE_FORMAT: 'DD/MM/YYYY HH:mm:ss',
};
