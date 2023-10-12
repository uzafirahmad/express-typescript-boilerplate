import express, { Router, Request, Response } from 'express';
import { fetchUser } from '../authentication/Views';
import { createNote, editNote, deleteNote, getNotes } from './Views';

const router: Router = express.Router();

//login required
router.delete("/delete", fetchUser, async (req: Request, res: Response) => {
    deleteNote(req,res);
});

//login required
router.get("/get", fetchUser, async (req: Request, res: Response) => {
    getNotes(req,res);
});

//login required
router.put("/edit", fetchUser, async (req: Request, res: Response) => {
    editNote(req,res);
});

//login required
router.post("/create", fetchUser, async (req: Request, res: Response) => {
    createNote(req,res);
});

 
export default router;