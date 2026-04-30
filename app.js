var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mbgRouter = require("./routes/mbg");
var kipkRouter = require("./routes/kipk");
var kategoriRouter = require("./routes/kategori");
var produkRouter = require("./routes/produk");
var flash = require("express-flash"); // Import library express flash
var session = require("express-session"); // Import library express session
var biodataRouter = require("./routes/biodata"); //memanggil router biodata
var mahasiswaRouter = require('./routes/mahasiswa');

var apiKategoriRouter = require('./routes/api/kategori');//api kategori
var apiProdukRouter = require('./routes/api/produk');//api produk

var registerUser = require('./routes/auth/register');
var loginUser = require('./routes/auth/login');

var app = express();

const memoryStore = require('session-memory-store')(session);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/static", express.static(path.join(__dirname, "public/images")));

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: true,
    secret: "secret",
  }),
);
app.use(flash());



app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/mbg", mbgRouter);
app.use("/kipk", kipkRouter);
app.use("/kategori", kategoriRouter);
app.use("/produk", produkRouter);
app.use("/biodata", biodataRouter); //memanggil router biodata
app.use("/mahasiswa", mahasiswaRouter);
app.use("/users", usersRouter);
app.use("/password", usersRouter);
app.use('/api/kategori', apiKategoriRouter); //api kategori
app.use('/api/produk', apiProdukRouter); //api produk

app.use('/api/register', registerUser);
app.use('/api/login', loginUser);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
