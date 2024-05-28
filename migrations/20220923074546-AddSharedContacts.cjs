// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SharedContacts', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            contactId : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Contacts', key: 'id' } },
            userId    : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('SharedContacts');
    }
};
