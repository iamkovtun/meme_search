# MemeSearch

MemeSearch is your ultimate meme database, designed to save and search memes with ease. Never struggle to find a meme you remember again with our powerful search feature that makes locating your favorite memes quick and effortless.

[Link to MemeSearch App](https://memesearch.iamkovtun.xyz)

**Note:** The app may not be currently operational due to server costs, especially given the GPU requirements. Please refer to the screenshots below for a visual representation of the app's functionality.

## Technology Stack

- Backend:
  - Node.js with Express.js
  - PostgreSQL database with Sequelize ORM
  - Multer for file uploads
- Frontend:
  - React.js
  - React Router for navigation
  - Styled-components for styling
- AI Services:
  - FastAPI for the AI service backend
  - PIL (Python Imaging Library) for image processing

## AI Technologies

MemeSearch leverages two main AI technologies:

1. **Image Description Generation**: This AI model analyzes the visual content of memes and generates descriptive text. It helps in categorizing and searching memes based on their visual elements.

2. **Text Extraction**: An OCR (Optical Character Recognition) model is used to extract any text present in the meme images. This allows for searching memes based on the text content within the images.

These AI technologies combine to provide a comprehensive search experience, allowing users to find memes based on both visual and textual content.

## Setup and Installation

### Backend
```bash
cd meme_search/backend
npm install
npm start
```
### Frontend
```bash
cd meme_search/frontend
npm install
npm start
```
### AI App
```bash
cd meme_search/ai-app
pip install -r requirements.txt
python api.py
```

## Screenshots

![Home Page](https://github.com/iamkovtun/meme_search/blob/2891e34d6d2ae210bce0eec7a42fd2b69f4c6ad6/screenshots/Screenshot_1.jpg)
*Home Page*



![Search Interface](https://github.com/iamkovtun/meme_search/blob/2891e34d6d2ae210bce0eec7a42fd2b69f4c6ad6/screenshots/Screenshot_2.jpg)
*Search Interface*


![Upload Meme Interface](https://github.com/iamkovtun/meme_search/blob/2891e34d6d2ae210bce0eec7a42fd2b69f4c6ad6/screenshots/Screenshot_3.jpg)
*Upload Meme Interface from mobile*

