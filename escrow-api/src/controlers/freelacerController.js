
const Freelancer = require('../models/Freelancer');

exports.getFreelancers = async (req, res) => {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
};

exports.getFreelancerById = async (req, res) => {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
    res.json(freelancer);
};

exports.updateFreelancer = async (req, res) => {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });

    const updatedFreelancer = await Freelancer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFreelancer);
};
