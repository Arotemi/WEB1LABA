import sequelize from 'sequelize';
import Base      from './Base.js';
import User      from './User.js';
import Contact   from './Contact.js';

const { DataTypes: DT } = sequelize;

class SharedContact extends Base {
    static options = {
        scopes : {
            userId(userId) {
                if (!userId) return {};

                return { where: { userId } };
            }
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        contactId : { type: DT.BIGINT, allowNull: true, references: { model: 'Users', key: 'id' } },
        userId    : { type: DT.BIGINT, allowNull: true, references: { model: 'Users', key: 'id' } },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.belongsTo(Contact, { foreignKey: 'contactId', sourceKey: 'id', as: 'contact' });
        this.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id', as: 'user' });
    }
}

export default SharedContact;
