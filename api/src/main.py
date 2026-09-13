from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def index():
    return {"message": "Backend is running and good to go!"}