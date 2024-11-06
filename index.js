import path from 'path';
import {fileURLToPath} from 'url';
import express from 'express';
import {nanoid} from 'nanoid';

// подключим multer
import multer from 'multer';

const app = express();

// инициализируем хранилище
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageExtensions = ['.jpg', '.png', '.svg'];
    const extension = path.extname(file.originalname);
    // Важно! Директории должны существовать
    const uploadPath = (imageExtensions.includes(extension)) ? 'upload/images' : 'upload';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Подготовим уникальное имя для файла
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueName}${extension}`);
  },

  
});



// инициализируем middleware
const upload = multer({storage: diskStorage, limits: {
  files: 2,
  fileSize: 1024 * 1024,
},});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'upload/images')));

// добавим middleware в цепочку обработчиков
app.post('/', upload.array('files', 5), (req, res) => {
  console.log(req.files);
  res.send('OK');
});

app.listen(8080);