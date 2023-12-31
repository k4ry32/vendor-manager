import { Router } from "express";
import {
    getAgreementsByAccount,
    getAgreementById,
} from "../controllers/agreements.js";
import auth from "../middlewares/auth.js";
import jwt from 'jsonwebtoken';

const router = Router();

/*
  GET agreements by account.
  @query {int} acount_id
*/
router.get("/", auth, async (req, res) => {
    // validate query params
    if (!req.query.account_id) {
        res.status(400).json({ error: "Missing account_id" });
        return;
    }

    const { account_id } = req.query;
    let token = req.headers.authorization?.split(' ')[1];
    let user = jwt.verify(token, process.env.JWT_SECRET);

    const agreements = await getAgreementsByAccount(account_id, user.id);

    if (agreements.error) {
        return res.status(400).json({ error: agreements.error });
    }

    res.status(200).json(agreements);
});

/* 
  GET agreement by id. 
  @param {int} id
  @query {int} acount_id
*/
router.get("/:id", auth, async (req, res) => {
    // validate query and params
    if (!req.query.account_id) {
        res.status(400).json({ error: "Missing account_id" });
        return;
    }
    if (!req.params.id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }

    const { account_id } = req.query;
    const { id } = req.params;

    const agreement = await getAgreementById(account_id, id);

    if (!agreement) {
        return res.status(404).json({ error: "Agreement not found" });
    } else if (agreement.error) {
        return res.status(400).json({ error: agreement.error });
    }

    res.status(200).json(agreement);
});

export default router;
