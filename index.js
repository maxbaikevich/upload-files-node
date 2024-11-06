import path from 'path';
import {fileURLToPath} from 'url';
import express from 'express';
import {nanoid} from 'nanoid';
import multer from 'multer';

const app = express();

const diskStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const imageExtensions = ['.jpg', '.png', '.svg'];
    const extension = path.extname(file.originalname);
    const uploadPath = (imageExtensions.includes(extension)) ? 'upload/images' : 'upload';
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueName}${extension}`);
  },

});
function errHandler(err, req,res,next){
  if(err.code) 
    res.send(err.code);
  else
    next()
}
const upload = multer({storage: diskStorage, limits: {
    files: 2,
    fileSize: 1024 * 1024,
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'upload/images')));

app.post('/', upload.array('files', 5), errHandler,  (req, res) => {
  console.log(req.files);
  res.send('OK фаил успешно загружен');
});
app.listen(8080);