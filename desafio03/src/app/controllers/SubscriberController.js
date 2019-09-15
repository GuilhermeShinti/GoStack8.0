import { Op } from 'sequelize/';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

class SubscriberController {
    async store(req, res) {
        const user = await User.findByPk(req.userId);
        const meetup = await Meetup.findByPk(req.params.id, {
            include: [User],
        });

        if (meetup.user_id === req.userId) {
            return res
                .status(400)
                .json({ error: "Can't subscribe you to own meetups." });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't subscribe to past meetups." });
        }

        const checkDate = await Subscription.findOne({
            where: {
                user_id: user.id,
            },
            include: [
                {
                    model: Meetup,
                    required: true,
                    where: {
                        date: meetup.date,
                    },
                },
            ],
        });

        if (checkDate) {
            return res.status(400).json({
                error: "Can't subscribe to two meetups at the same time.",
            });
        }

        const subscription = await Subscription.create({
            user_id: user.id,
            meetup_id: meetup.id,
        });

        return res.json(subscription);
    }

    async index(req, res) {
        const subscriptions = await Subscription.findAll({
            where: { user_id: req.userId },
            include: [
                {
                    model: Meetup,
                    where: {
                        date: {
                            [Op.gt]: new Date(),
                        },
                    },
                    required: true,
                },
            ],
            order: [[Meetup, 'date']],
        });

        res.json(subscriptions);
    }
}

export default new SubscriberController();
