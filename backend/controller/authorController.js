import authors from "../model/author.js";

export async function getAllAuthors(req, res) {
    try {
        const author = await authors.find();
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createAuthor(req, res) {
    try {
        const author = {
            name: req.body.name,
            qualification: req.body.qualification,
            birthDate: req.body.birthDate,
            nationality: req.body.nationality
        };

        const savedAuthor = await authors.create(author);

        res.status(201).json(savedAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


