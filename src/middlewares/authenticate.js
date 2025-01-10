import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    
    const {token} = req.query;
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
    
};

export default authenticate;