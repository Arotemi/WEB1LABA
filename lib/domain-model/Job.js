import sequelize from 'sequelize';
import Base      from './Base.js';
import Sessions  from './Session.js';

const { DataTypes: DT } = sequelize;

class Job extends Base {
    static options = {
        scopes : {
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        type      : { type: DT.ENUM('EMAIL', 'IMPORT'), allowNull: false },
        data      : { type: DT.JSON, allowNull: false },
        result    : { type: DT.JSON, allowNull: true },
        status    : { type: DT.ENUM('PENDING', 'SUCCESS', 'FAILED'), allowNull: false },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.hasMany(Sessions, { foreignKey: 'userId', sourceKey: 'id', as: 'sessions' });
    }
}

export default Job;
