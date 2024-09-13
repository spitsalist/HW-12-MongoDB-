import { ObjectId } from 'mongodb';

export const validObjectId = (req, res, next) => {
    const { id } = req.params;
    if(!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product id" });
    }
    next();
}