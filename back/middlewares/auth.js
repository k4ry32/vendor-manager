import jwt from 'jsonwebtoken';

export default async function auth(req, res, next) {
    // validate header autorization
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Missing autorization header' });
    }

    //decode token with jwt
    let token = req.headers.authorization?.split(' ')[1];

    if(token === 'null') {
        return res.status(401).json({ message: 'Missing token' });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    //validate user role
    let url = decodeURIComponent(req.originalUrl);

    let isAuthorized = true;

    if(url.includes('/admin') && decoded.role !== 'admin') {
        isAuthorized = false;
    }   

    if(!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
   

    next();
}