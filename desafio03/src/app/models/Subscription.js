import { Model } from 'sequelize';

class Subscription extends Model {
    static(sequelize) {
        super.init({}, { sequelize });
    }

    static associate(models) {
        this.belongsTo(models.Meetup, {
            foreignKey: 'meetup_id',
            as: 'meetup',
        });
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }
}

export default Subscription;
