// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Jobs', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            type      : { type: Sequelize.ENUM('EMAIL', 'IMPORT'), allowNull: false },
            data      : { type: Sequelize.JSON, allowNull: false },
            result    : { type: Sequelize.JSON, allowNull: true },
            status    : { type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'), allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Jobs');
    }
};
