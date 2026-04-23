var express = require("express");
const model_produk = require("../../model/model_produk");
const model_kategori = require("../../model/model_kategori");
var router = express.Router();

const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* GET: Ambil semua data produk */
router.get("/", async function (req, res, next) {
  try {
    let rows = await model_produk.getAll();
    return res.status(200).json({
      status: "success",
      message: "Data berhasil diambil",
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
});

/* POST: Tambah data produk (Dilengkapi validasi) */
router.post("/store", upload.single("gambar_produk"), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "File gambar_produk wajib diunggah atau path file di Postman rusak!",
      });
    }

    const { nama_produk, harga, id_kategori } = req.body;

    if (!nama_produk || !harga || !id_kategori) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "error",
        message: "Data nama_produk, harga, dan id_kategori harus diisi!",
      });
    }

    const data = {
      nama_produk,
      harga,
      id_kategori,
      gambar_produk: req.file.filename,
    };

    await model_produk.store(data);
    return res.status(201).json({
      status: "success",
      message: "Data berhasil ditambahkan",
      data: data
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: "error",
      message: "Gagal menambahkan data: " + err.message,
    });
  }
});

/* GET: Ambil detail produk berdasarkan ID */
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await model_produk.getId(id);

    if (rows.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Data berhasil diambil",
        data: rows[0],
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
});

/* POST: Update data produk */
router.post("/update/:id", upload.single("gambar_produk"), async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_produk, harga, id_kategori } = req.body;
    let filebaru = req.file ? req.file.filename : null;

    let rows = await model_produk.getId(id);
    if (rows.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path); // hapus file baru jika data tidak ada
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
    }

    let data = { nama_produk, harga, id_kategori };
    let namafilelama = rows[0].gambar_produk;

    if (filebaru) {
      data.gambar_produk = filebaru;
      if (namafilelama) {
        const pathfilelama = path.join(__dirname, '../../public/images/', namafilelama);
        if (fs.existsSync(pathfilelama)) {
          fs.unlinkSync(pathfilelama);
        }
      }
    }

    await model_produk.update(id, data);
    return res.status(200).json({
      status: "success",
      message: "Data produk berhasil diperbarui!",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Gagal memperbarui data: " + err.message });
  }
});

/* GET: Hapus data produk */
router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let produkRows = await model_produk.getId(id);

    if (produkRows.length === 0) {
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
    }

    let namafilelama = produkRows[0].gambar_produk;
    if (namafilelama) {
      const pathfilelama = path.join(__dirname, '../../public/images/', namafilelama);
      if (fs.existsSync(pathfilelama)) {
        fs.unlinkSync(pathfilelama);
      }
    }

    await model_produk.delete(id);
    
    return res.status(200).json({
      status: "success",
      message: "Data produk beserta gambarnya berhasil dihapus!",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Gagal menghapus data" });
  }
});

module.exports = router;