import {Router, Request, Response} from 'express';

import {User} from '../models/User';
import {AuthRouter, requireAuth} from './auth.router';


const router: Router = Router();

// Handles GET requests for /users endpoint.
const getUserHandler = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id === null) {
        const users = await User.findAll();
        res.send(users);
        return;
    }

    const item = await User.findByPk(id);
    res.send(item);
};

// Handles authentication through jwt.
router.use('/auth', AuthRouter);
// Routes to interact with user resource.
router.get('/', requireAuth, getUserHandler);
router.get('/:id', requireAuth, getUserHandler);

export const UserRouter: Router = router;
