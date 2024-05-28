import sequelize from 'sequelize';
import Exception from 'chista/Exception.js';
import Base      from './Base.js';
import User      from './User.js';

const { DataTypes: DT } = sequelize;

class Sessions extends Base {
    static schema = {
        sid     : { type: DT.STRING, primaryKey: true },
        expires : { type: DT.DATE },
        data    : { type: DT.TEXT },
        userId  : { type: DT.BIGINT, allowNull: true },
        context : {
            type : DT.VIRTUAL,
            get() {
                const data = this.getDataValue('data');
                const json = data ? JSON.parse(data) : {};

                return json.context || {};
            }
        }
    };

    static initRelations() {
        this.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    }

    static async validateSession(session) {
        const userId = session?.context?.userId || null;

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            throw new Exception.default({ code: 'SESSION_REQUIRED', fields: { } });
        }

        return user;
    }
}

export default Sessions;
