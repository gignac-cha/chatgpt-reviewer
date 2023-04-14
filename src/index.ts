import { config } from 'dotenv';
import { Request, Response } from 'express';

config();

export default async (req: Request, res: Response) => {
  const { GITHUB_ACCESS_TOKEN, OPENAI_API_KEY } = process.env;
  if (!GITHUB_ACCESS_TOKEN) {
    console.error('`GITHUB_ACCESS_TOKEN` is not defined.');
    return;
  }
  if (!OPENAI_API_KEY) {
    console.error('`OPENAI_API_KEY` is not defined.');
    return;
  }

  res.json({ hello: 'world' });

  const { action, number, pull_request, repository, sender } = req.body;
  console.log(action, number, repository.full_name);
};
