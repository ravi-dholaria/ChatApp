import  express from 'express';

const router = express.Router();
router.get("/", (req, res) => (res.send("Welcome to Chat App!")));
export default router;