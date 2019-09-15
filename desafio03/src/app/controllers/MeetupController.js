import { startOfDay, endOfDay, parseISO, isBefore, Op } from 'date-fns';
import * as Yup from 'yup';
import User from '../models/User';
import Meetup from '../models/Meetup';

class MeetupController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            file_id: Yup.number().required(),
            location: Yup.string().requided(),
            schedule: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        if (isBefore(parseISO(req.body.schedule), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        const user_id = req.userId;

        const meetup = await Meetup.create({
            ...req.body,
            user_id,
        });

        return res.json(meetup);
    }

    async index(req, res) {
        const where = {};
        const page = req.query.page || 1;

        if (req.query.date) {
            const searchDate = parseISO(req.query.schedule);
            where.date = {
                [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
            };
        }

        const meetups = await Meetup.findAll({
            where,
            include: [User],
            limit: 10,
            offset: 10 * page - 10,
        });
        return res.json(meetups);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            file_id: Yup.number().required(),
            location: Yup.string().requided(),
            schedule: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const user_id = req.userId;

        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            return res.status(401).json({ error: 'Not autorized.' });
        }

        if (isBefore(parseISO(req.body.schedule), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid.' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't update past meetups." });
        }

        await meetup.update(req.body);

        return res.json(meetup);
    }

    async delete(req, res) {
        const user_id = req.userId;

        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            return res.status(401).json({ error: 'Not autorized.' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't delete past meetups." });
        }

        await meetup.destroy();

        return res.send();
    }
}

export default new MeetupController();
