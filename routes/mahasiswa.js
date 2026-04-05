const express = require("express");
const router = express.Router();
const connection = require("../config/database");
const model_mahasiswa = require("../model/model_mahasiswa");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify destination as public/images/mahasiswa/
    let dir = "public/images/mahasiswa/";
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* GET home page */
router.get("/", async function (req, res, next) {
  try {
    let rows = await model_mahasiswa.getAll();
    res.render("mahasiswa/index", {
      title: "Data Mahasiswa",
      mahasiswa: rows,
      messages: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (err) {
    next(err);
  }
});

/* GET create form */
router.get("/create", function (req, res, next) {
  res.render("mahasiswa/create", {
    title: "Tambah Mahasiswa",
    messages: {
        error: req.flash("error")
    }
  });
});

/* POST store data */
router.post("/store", upload.single("foto_mahasiswa"), async function (req, res, next) {
  try {
    const { nrp, nama, jenis_kelamin } = req.body;
    
    // Check NRP
    let check = await model_mahasiswa.checkNrp(nrp);
    if (check.length > 0) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {}
      }
      req.flash("error", "NRP sudah terdaftar!");
      return res.redirect("/mahasiswa/create");
    }

    const data = {
      nrp,
      nama,
      jenis_kelamin,
      foto_mahasiswa: req.file ? req.file.filename : null,
    };

    await model_mahasiswa.store(data);
    req.flash("success", "Data mahasiswa berhasil ditambahkan!");
    res.redirect("/mahasiswa");
  } catch (err) {
    next(err);
  }
});

// Route untuk menampilkan halaman edit
router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await model_mahasiswa.getId(id);

    if (rows.length > 0) {
      res.render("mahasiswa/edit", {
        title: "Edit Mahasiswa",
        data: rows[0],
        messages: {
            error: req.flash("error")
        }
      });
    } else {
      res.status(404).send("Data tidak ditemukan");
    }
  } catch (err) {
    next(err);
  }
});

// Route untuk memproses update data
router.post("/update/:id", upload.single("foto_mahasiswa"), async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nrp, nama, jenis_kelamin } = req.body;

    // Check NRP if conflicts with others (exclude this id)
    let check = await model_mahasiswa.checkNrp(nrp, id);
    if (check.length > 0) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {}
      }
      req.flash("error", "NRP sudah terdaftar di mahasiswa lain!");
      return res.redirect("/mahasiswa/edit/" + id);
    }

    let filebaru = req.file ? req.file.filename : null;
    let data = { nrp, nama, jenis_kelamin };

    let rows = await model_mahasiswa.getId(id);
    let namafilelama = rows.length > 0 ? rows[0].foto_mahasiswa : null;

    if (filebaru) {
      data.foto_mahasiswa = filebaru;
      if (namafilelama) {
        const pathfilelama = path.join(__dirname, '../public/images/mahasiswa/', namafilelama);
        try {
          fs.unlinkSync(pathfilelama);
        } catch (err) {}
      }
    }

    await model_mahasiswa.update(id, data);
    req.flash("success", "Data mahasiswa berhasil diperbarui!");
    res.redirect("/mahasiswa");
  } catch (err) {
    req.flash("error", "Gagal memperbarui data");
    res.redirect("/mahasiswa");
  }
});

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    let rows = await model_mahasiswa.getId(id);
    let namafilelama = rows.length > 0 ? rows[0].foto_mahasiswa : null;

    if (namafilelama) {
      const pathfilelama = path.join(__dirname, '../public/images/mahasiswa/', namafilelama);
      try {
        fs.unlinkSync(pathfilelama);
      } catch (err) {}
    }

    await model_mahasiswa.delete(id);
    req.flash("success", "Data mahasiswa berhasil dihapus!");
    res.redirect("/mahasiswa");
  } catch (err) {
    req.flash("error", "Gagal menghapus data");
    res.redirect("/mahasiswa");
  }
});

module.exports = router;
