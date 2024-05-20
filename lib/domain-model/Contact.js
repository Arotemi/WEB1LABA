import sequelize from 'sequelize';
import Base      from './Base.js';
import Sessions  from './Session.js';

const { DataTypes: DT } = sequelize;

class Contact extends Base {
    static options = {
        scopes : {
            id(id) {
                if (!id?.length) return {};

                return { where: { id } };
            },
            userId(userId) {
                if (!userId) return {};

                return { where: { userId } };
            },
            search(search) {
                if (!search) return {};

                const againstSearch = search
                    .replace(/[\s+\-*<>()~"@%]+/g, ' ')
                    .replace(/(\S+)/g, '+$&*');

                return {
                    where        : sequelize.literal('MATCH (firstName, lastName, phone) AGAINST (:againstSearch IN BOOLEAN MODE)'),
                    replacements : { againstSearch }
                };
            }
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        userId    : { type: DT.BIGINT, allowNull: true, references: { model: 'Users', key: 'id' } },
        firstName : { type: DT.STRING, allowNull: false },
        lastName  : { type: DT.STRING, allowNull: false },
        phone     : { type: DT.STRING, allowNull: false },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.hasMany(Sessions, { foreignKey: 'userId', sourceKey: 'id', as: 'sessions' });
    }
}

export default Contact;


// change
