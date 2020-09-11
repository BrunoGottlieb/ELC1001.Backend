const Calendar = require('../models/calendar.model');
const convertDate = require('../util/formatDate');
const moment = require('moment');
exports.getLook = async (req, res) => {
    try {
        const user = req.user._id;
        const { day, shift } = req.params;
        const dia = convertDate(day);
        const look = await Calendar
            .find({
                owner: { $eq: user },
                date: {
                    $gte: dia.format("YYYY-MM-DD"),
                    $lte: dia.add(1, 'days').format("YYYY-MM-DD")
                },
                shift: { $eq: shift }
            });
        if (!look)
            return res.status(404);
        return res.status(200).json(look);
    }
    catch (err) {
        console.error(err, err.message, err.stack);
        return res.status(500).send({
            message: "Error retrieving look for day"
        });
    }
};
exports.setLook = async (req, res) => {
    // Se já houver um look atribuído para esse mesmo dia e turno, sobrescreva-o.
    const { _id, owner } = req.body;
    const look_id = _id;
    if (owner != req.user._id) {
        return res.status(401).send({
            message: "Not permission user id setting look"
        });
    }
    const { day, shift } = req.params;
    const dia = convertDate(day);
    const look = await Calendar
        .find({
            owner: { $eq: user },
            date: {
                $gte: dia.format("YYYY-MM-DD"),
                $lte: dia.add(1, 'days').format("YYYY-MM-DD")
            },
            shift: { $eq: shift }
        });
    if (look._id == look_id) {
        return res.status(400).send({
            message: "Error setting the same look "
        });
    }
    const calendar = new Calendar(
        {
            date: moment().format("YYYY-MM-DD"),
            owner,
            shift,
            look: look_id
        }
    );

    try {
        await calendar.save();
        res.status(201).send(calendar);
    }
    catch (err) {
        console.error(err, err.message, err.stack);
        return res.status(500).send({
            message: "Error setting look for day"
        });
    }
};