# Image to WEBP Converter

This project is a simple React application for uploading images, converting them to WEBP format, and downloading them as a ZIP file. It uses a Node.js backend to handle file processing.

---

## Features

- Drag-and-drop file upload support.
- Preview uploaded images.
- Convert images to WEBP format.
- Download converted images as a ZIP file.

---

## Tech Stack

### Frontend

- React
- CSS (BEM methodology for class naming)

### Backend

- Node.js
- Express
- Multer (for file handling)
- Sharp (for image processing)

---

## Installation

### Prerequisites

- Node.js installed on your system.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repository/image-to-webp
   cd image-to-webp
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Start the development server:

   ```bash
   # Start the backend server
   cd server
   node index

   # Start the React development server
   cd ../client
   npm start
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## File Structure

```
image-to-webp/
|
|-- client/           # Frontend React application
|   |-- public/       # Public assets
|   |-- src/          # React components and styles
|       |-- App.js    # Main React component
|       |-- styles/   # CSS files (BEM methodology)
|
|-- server/           # Backend Node.js server
|   |-- temp/         # Temporary file storage
|   |-- app.js        # Main server file
|
|-- README.md         # Project documentation
```

---

## Usage

1. Drag and drop images into the upload area or click to select files.
2. Click the **Upload Images** button to start the conversion process.
3. Once processed, a download link will appear. Click it to download the ZIP file containing the converted images.

---

## API Endpoints

### POST `/upload`

- **Description**: Handles image uploads and converts them to WEBP format.
- **Request**:
  - `Content-Type: multipart/form-data`
  - Payload: Images as files.
- **Response**:
  - `200 OK`: Provides a link to download the converted images.
  - `400 Bad Request`: If the uploaded files are not images.

---

## Dependencies

### Frontend

- `react`
- `axios`

### Backend

- `express`
- `multer`
- `sharp`

---

## Known Issues

- Large image files may cause performance issues depending on server configuration.
- File uploads are limited to images only.

---

## Future Enhancements

- Add support for other image formats.
- Implement real-time progress feedback for uploads.
- Improve error handling for edge cases.

---


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or new features.

---

## Contact

For any questions or feedback, please contact:

- **Name**: Mugesh kannan
- **Email**: [mkannan2104@gmail.com](mailto\:mkannan2104@gmail.com)

