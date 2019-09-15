import Meetup from '../models/Meetup';

class OrganizerController {
    async index(req, res) {
        const meetups = await Meetup.findAll({
            where: { user_id: req.userId },
        });
        return res.json(meetups);
    }
}

export default new OrganizerController();
