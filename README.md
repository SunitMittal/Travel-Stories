### TravelStory

TravelStory is a full‑stack Travel Journal app where users can create, view, search, filter, favorite, edit, and delete their travel stories with images. It includes secure authentication and a modern, responsive UI.

## Features

- **Authentication**: Sign up, login with JWT-based auth
- **Create & edit stories**: Title, story text, visited locations (tags), date
- **Image upload**: Upload and serve images via the backend
- **Favorite stories**: Mark/unmark stories as favourites
- **Search**: Keyword search across title, story, and locations
- **Date range filter**: Filter stories by visited date range
- **Responsive UI**: Clean, modern layout with modals and toasts

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios
- **Backend**: Node.js, Express, MongoDB
- **Deployment:** Vercel, Render

## Usage

1. Start the backend and the frontend.
2. In the app:
   - Create an account via Sign Up or login.
   - Add a new travel story with title, date, locations, story text, and optional image.
   - Click a story to view details; edit or delete from the modal.
   - Use the heart icon to mark favourites.
   - Search by keywords, or filter by date range using the calendar.
