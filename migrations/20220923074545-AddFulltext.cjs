// eslint-disable-next-line import/no-commonjs
module.exports = {
    async up(queryInterface) {
        await queryInterface.addIndex('Contacts', [ 'firstName', 'lastName', 'phone' ], {
            type : 'FULLTEXT',
            name : 'Contacts_ft_fname_lname_phone'
        });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('Contacts', 'Contacts_ft_fname_lname_phone');
    }
};
