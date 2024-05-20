// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Contacts', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            userId    : { type: Sequelize.BIGINT, allowNull: true, references: { model: 'Users', key: 'id' } },
            firstName : { type: Sequelize.STRING, allowNull: false },
            lastName  : { type: Sequelize.STRING, allowNull: false },
            phone     : { type: Sequelize.STRING, allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Contacts');
    }
};
