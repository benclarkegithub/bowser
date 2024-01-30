import dotenv
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from loguru import logger
from openai import OpenAI
from pydantic import BaseModel

from prompts import GET_ACTIONS_SYSTEM_MESSAGE


dotenv.load_dotenv()

app = FastAPI()
client = OpenAI()


class PromptRequest(BaseModel):
    prompt: str


@app.post("/get-actions", response_class=PlainTextResponse)
async def get_actions(request: PromptRequest):
    logger.info(f"Prompt: {request.prompt}")

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": GET_ACTIONS_SYSTEM_MESSAGE},
            {"role": "user", "content": request.prompt},
        ],
        temperature=0.2,
    )

    logger.info(f"Output: {completion.choices[0].message.content}")

    return completion.choices[0].message.content
