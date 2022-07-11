const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

app.set('view engine', '.hbs');

app.engine(
  'hbs',
  hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' })
);

// middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use('uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.get('/', (req, res) => {
  res.render('index');
});

//request of name placeholder from `hello.hbs`
app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/send-message', upload.single('image'), (req, res) => {
  const { author, sender, title, message } = req.body;

  if (author && sender && title && req.file && message) {
    res.render('contact', { isSent: true, fileName: req.file.originalname });
  } else {
    res.render('contact', { isError: true });
  }
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
