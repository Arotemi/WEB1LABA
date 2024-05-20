import crypto    from 'crypto';
import sequelize from 'sequelize';
import Base      from './Base.js';
import Sessions  from './Session.js';

const { DataTypes: DT } = sequelize;

const SALT_LENGTH = 16;
const KEY_LENGTH  = 64;

class User extends Base {
    static GENDERS = {
        MALE   : 'MALE',
        FEMALE : 'FEMALE',
        OTHER  : 'OTHER'
    }

    static options = {
        scopes : {
            email(email) {
                if (!email) return {};

                return { where: { email } };
            }
        }
    }

    static schema = {
        id           : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name         : { type: DT.STRING, allowNull: false },
        gender       : { type: DT.ENUM(Object.values(this.GENDERS)), allowNull: true },
        email        : { type: DT.STRING, allowNull: false, unique: true },
        passwordHash : { type: DT.STRING,  allowNull: false, defaultValue: '' },
        salt         : { type: DT.STRING,  allowNull: false, defaultValue: '' },
        password     : {
            type : DT.VIRTUAL,
            set(password) {
                const salt = this._generateSalt();
                const passwordHash = this._hashPassword(password, salt);

                this.setDataValue('salt', salt);
                this.setDataValue('passwordHash', passwordHash);
            }
        },
        birthDate : { type: DT.DATEONLY, allowNull: false },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.hasMany(Sessions, { foreignKey: 'userId', sourceKey: 'id', as: 'sessions' });
    }

    checkPassword(plain) {
        const hash = this._hashPassword(plain, this.salt);

        return hash === this.passwordHash;
    }

    _generateSalt() {
        const salt = crypto.randomBytes(SALT_LENGTH);

        return salt.toString('hex');
    }

    _hashPassword(password, salt) {
        const hash = crypto.scryptSync(password, salt, KEY_LENGTH); // eslint-disable-line no-sync

        return hash.toString('hex');
    }
}

export default User;



// change