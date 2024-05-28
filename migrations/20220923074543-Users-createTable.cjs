// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id           : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name         : { type: Sequelize.STRING, allowNull: false },
            gender       : { type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
            email        : { type: Sequelize.STRING, allowNull: false, unique: true },
            passwordHash : { type: Sequelize.STRING,  allowNull: false, defaultValue: '' },
            salt         : { type: Sequelize.STRING,  allowNull: false, defaultValue: '' },
            birthDate    : { type: Sequelize.DATEONLY, allowNull: false },
            isAdmin      : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            createdAt    : { type: Sequelize.DATE, allowNull: false },
            updatedAt    : { type: Sequelize.DATE, allowNull: false }
        }, { charset: 'utf8mb4' });

        await queryInterface.createTable('Sessions', {
            sid       : { type: Sequelize.STRING, primaryKey: true },
            expires   : { type: Sequelize.DATE },
            data      : { type: Sequelize.TEXT },
            userId    : { type: Sequelize.BIGINT, allowNull: true, references: { model: 'Users', key: 'id' } },
            createdAt : { type: Sequelize.DATE,   allowNull: false },
            updatedAt : { type: Sequelize.DATE,   allowNull: false }
        }, { charset: 'utf8mb4' });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Sessions');
        await queryInterface.dropTable('Users');
    }
};
