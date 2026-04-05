var express = require("express");
const connection = require("../config/database");
const model_produk = require("../model/model_produk");
const model_kategori = require("../model/model_kategori");
var router = express.Router();

const fs = require("fs");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* GET home page */
router.get("/", async function (req, res, next) {
  let rows = await model_produk.getAll();
  res.render("produk/index", {
    title: "Halaman Produk",
    produk: rows,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
});

/* GET create form */
router.get("/create", async function (req, res, next) {
  try {
    // 1. Tambahkan 'await' karena getAll() itu Promise
    // 2. Gunakan model_kategori (pastikan sudah di-require di atas)
    let dataKategori = await model_kategori.getAll();

    res.render("produk/create", {
      title: "Create Produk",
      kategori: dataKategori, // Sekarang ini sudah menjadi Array
    });
  } catch (err) {
    // Tangani error jika database bermasalah
    next(err);
  }
});

/* POST store data */
router.post("/store",  upload.single("gambar_produk"),
  async function (req, res, next) {
    try {
      // Ambil semua data dari form body
      const { nama_produk, harga, id_kategori } = req.body;
      // Bungkus dalam satu objek agar sesuai dengan parameter 'data' di model
      const data = {
        nama_produk,
        harga,
        id_kategori,
        gambar_produk: req.file.filename,
      };
      // Kirim objek 'data' ke model
      await model_produk.store(data);
      // Redirect setelah berhasil
      res.redirect("/produk");
    } catch (err) {
      // Tangani error jika input gagal
      next(err);
    }
  },
);

// Route untuk menampilkan halaman edit
router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await model_produk.getId(id); // Ini menghasilkan array [ {id: 1, nama: '...'} ]
    let kategori = await model_kategori.getAll();

    // Pastikan data ditemukan sebelum render
    if (rows.length > 0) {
      res.render("produk/edit", {
        title: "Edit Produk",
        data: rows[0], // AMBIL INDEX KE-0 AGAR BISA DIBACA data.nama_produk
        kategori: kategori,
      });
    } else {
      res.status(404).send("Data tidak ditemukan");
    }
  } catch (err) {
    next(err);
  }
});

// Route untuk memproses update data
router.post("/update/:id", upload.single("gambar_produk"), async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_produk, harga, id_kategori } = req.body;
    let filebaru = req.file ? req.file.filename: null;
    let data = { nama_produk, harga, id_kategori };

    let rows = await model_produk.getId(id);
    let namafilelama = rows.length > 0 ? rows[0].gambar_produk : null;

    if(filebaru){
      data.gambar_produk = filebaru;
      if(namafilelama){
        const pathfilelama = path.join(__dirname, '../public/images/', namafilelama);
        try {
          fs.unlinkSync(pathfilelama);
        } catch (err) {}
      }
    }


    
    await model_produk.update(id, data);
    req.flash("success", "Data produk berhasil diperbarui!");
    res.redirect("/produk");
  } catch (err) {
    req.flash("error", "Gagal memperbarui data");
    res.redirect("/produk");
  }
});

router.get("/delete/:id", async function (req, res, next) {
  let id = req.params.id;

  let produkRows = await model_produk.getId(id);
  let namafilelama = produkRows.length > 0 ? produkRows[0].gambar_produk : null;

  if (namafilelama) {
    const pathfilelama = path.join(__dirname, '../public/images/', namafilelama);
    try {
      fs.unlinkSync(pathfilelama);
    } catch (err) {}
  }

  let rows = await model_produk.delete(id);
  res.render("produk/delete", {
    title: "DeleteProduk",
    produk: rows,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
  return res.redirect("/produk");
});

module.exports = router;
