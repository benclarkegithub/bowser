# Bowser

The project I worked on for the E/acc Hackathon (Saturday, January 27th - Sunday, January 28th).
Bowser is a Google Chrome extension that can execute actions on a webpage from natural language instructions.
Given instructions, it can click, fill a form, and output to the extension's popup.
Some examples can be found below.

## Installation

The extension consists of two parts: the `agent` (Python back-end) and the `extension` (JavaScript front-end).
Both need to be running for the plugin to work!

### Agent

1. `cd ./agent`
2. `python3 -m pip install pipenv`

You'll also need to create a `.env` file in the `agent` folder with the following contents (add your OpenAI API key):

```
OPENAI_API_KEY = ""
```

#### To Run Locally

1. `cd ./agent`
1. `python3 -m pipenv shell`
2. `uvicorn main:app --host 0.0.0.0 --port 8000`

#### To Run Docker

You'll need Docker installed to do this, I recommend following the steps in "To Run Locally" instead.

docker build -t agent_image .
docker run -p 8000:8000 agent_image --name agent_container

### Extension

1. Open Google Chrome
2. Click on the "Extensions" button (puzzle icon) > "Manage Extensions"
3. Enable "Developer Mode"
4. Click "Load unpacked" > Select the `extension` folder

## Troubleshooting

If something goes wrong while running the plugin:

1. Open Google Chrome
2. Click on the "Extensions" button (puzzle icon) > "Manage Extensions"
3. "Remove" the extension
4. "Load unpacked" the extension
