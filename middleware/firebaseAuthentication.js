const { admin } = require('../firebase/admin')

const FirebaseAuthenticationMiddleware = async (req, res, next) => {
    try {
        const credential = req.headers['authorization'];
        if (!credential) {
            return res.status(401).json('credentiala not found');
        }
        const token = credential.split(' ')[1];

        if (!token) {
            return res.status(401).send('token not found');
        }
        const decodedValue = await admin.auth().verifyIdToken(token);
        const validateUser = await admin.auth().getUser(decodedValue.uid);
        if (!validateUser) {
            return res.status(401).send(' User not found');
        }
        req.user = validateUser.providerData[0];
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
}

module.exports = FirebaseAuthenticationMiddleware;