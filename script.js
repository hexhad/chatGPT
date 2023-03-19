import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import readline from "readline";
import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

// Config
config();
const log = console.log;
const openAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

// const getUi = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// getUi.on("line", async (input) => {getUi.prompt();})

// getUi.prompt();

// const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));
// await sleep();

log(
  chalk.red.underline.bold(process.env.API_KEY) +
    " " +
    chalk.bgRed("will not available\n")
);

// Init
let Model = await whichGPT();
let Question = await askQuestion();
await gptCall(Model, Question);

// GPT task
async function gptCall(model, input) {
  log(chalk.green('"%s" and "%s" were your choices !! '), model, input);

  const spinner = createSpinner("Waiting For gpt...").start();

  const resp = await openAI.createChatCompletion({
    model: model,
    messages: [{ role: "user", content: input }],
  });

  if (resp.request.aborted) {
    spinner.error({ text: "aborted" });
    process.exit(1);
  } else {
    let cont = resp.data.choices[0].message.content;
    let preProssed = cont.includes("\n\n")
      ? cont.replace("\n\n", "")
      : cont.replace("\n", "");
    spinner.success({ text: preProssed });
  }
}

// Question
async function askQuestion() {
  const Q = await inquirer.prompt({
    name: "ans",
    type: "input",
    message: "Question?",
  });
  return Q.ans;
}

// Select Model
async function whichGPT() {
  const Q = await inquirer.prompt({
    name: "ans",
    type: "list",
    message: "which GPT?",
    choices: ["gpt-4", "gpt-3.5-turbo"],
    default() {
      return "gpt-3.5-turbo";
    },
  });
  return Q.ans;
}
