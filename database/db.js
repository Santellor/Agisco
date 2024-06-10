import { Sequelize } from 'sequelize';

async function connectToDB(dbURI) {
    console.log(`Connecting to Db: ${dbURI}`);

    const sequelize = new Sequelize(dbURI, {
        logging: false, // maybe turn this off after initializing?
        define: {
            underscored: true,
            timestamps: false
        },
        password: 'admin' // incredibly secure
    });

    try {
        await sequelize.authenticate();
        console.log(`Connected to DB successfully`);
    } catch (error) {
        console.error(`Unable to connect to DB ${dbURI}:, error`);
    }

    return sequelize;
}

export default connectToDB;