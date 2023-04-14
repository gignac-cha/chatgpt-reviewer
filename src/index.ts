import { config } from 'dotenv';
import { Request, Response } from 'express';
import { Octokit } from 'octokit';
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponseChoicesInner, OpenAIApi } from 'openai';

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

  if (req.body) {
    const { action, number, pull_request, repository, sender } = req.body;
    console.log(action, number, repository.full_name);

    if (action === 'opened' || action === 'reopened') {
      const owner: string = repository.owner.login;
      const repo: string = repository.name;
      const pull_number: number = number;

      try {
        const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });
        const { data: files } = await octokit.rest.pulls.listFiles({
          owner,
          repo,
          pull_number,
        });
        console.log(files.length);
        console.log('here');

        const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
        const openai = new OpenAIApi(configuration);

        const model = 'gpt-3.5-turbo-0301';
        const messages: ChatCompletionRequestMessage[] = [
          { role: 'system', content: 'You are the senior software engineer.' },
          { role: 'system', content: 'You are the powerful advisor.' },
          { role: 'system', content: 'You are the reviewer for the pull request.' },
          {
            role: 'user',
            content: `Review and optimize following code.
  You can fix the code in the diff code block.
  You can attach the detailed reason for the fix.
  The last line of your answer MUST contain the line number in the following JSON format.
  { "start": <START_LINE_NUMBER>, "end": <END_LINE_NUMBER> }`,
          },
        ];

        for (const { filename, status, sha, patch } of files) {
          if ((status === 'added' || status === 'changed') && patch) {
            const { data: chatCompletion } = await openai.createChatCompletion({
              model,
              messages: [...messages, { role: 'user', content: patch }],
            });
            const body: string = chatCompletion.choices.map((choice: CreateChatCompletionResponseChoicesInner) => choice.message).join('\n');
            console.log(status, sha, filename, body);

            // await octokit.rest.pulls.createReviewComment({
            //   owner,
            //   repo,
            //   pull_number,
            //   path: filename,
            //   commit_id: sha,
            //   body,
            //   start_line,
            //   line,
            // })
          }
        }
      } catch (e) {
        console.log('error', e);
      }
    }
  }

  res.json({ hello: 'world' });
};
