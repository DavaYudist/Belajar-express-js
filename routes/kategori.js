var express = require("express");
const connection = require("../config/database");
const model_kategori = require("../model/model_kategori");
var router = express.Router();
/* GET home page */
router.get("/", async function (req, res, next) {
  let rows = await model_kategori.getAll();
  res.render("kategori/index", {
    title: "Halaman Kategori",
    kategori: rows,
    messages: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
});

/* GET create form */
router.get("/create", function (req, res, next) {
  res.render("kategori/create", { title: "Tambah Kategori" });
});

/* POST store data */
router.post("/store", async function (req, res, next) {
  try {
    let nama_kategori = req.body.nama_kategori;
    await model_kategori.store(nama_kategori);
    req.flash("success", "Kategori berhasil ditambahkan!");
    res.redirect("/kategori");
  } catch (err) {
    req.flash("error", "Gagal menambahkan kategori.");
    res.redirect("/kategori");
  }
});

/* GET edit form */
router.get("/edit/:id", function (req, res, next) {
  const id_kategori = req.params.id;
  model_kategori
    .getId(id_kategori)
    .then((data) => {
      res.render("kategori/edit", {
        kategori: data[0],
        title: "Edit Kategori",
      });
    })
    .catch((err) => {
      console.error("Error : ", err);
      return res.status(500).send("Terjadi Kesalahan, Error : " + err);
    });
});

/* POST update data */
router.post("/update/:id", async function (req, res, next) {
  let id = req.params.id;
  let nama_kategori = req.body.nama_kategori;
  try {
    await model_kategori.update(id, nama_kategori);
    req.flash("success", "Berhasil memperbarui data");
  } catch (err) {
    req.flash("error", "Gagal memperbarui data");
  }
  return res.redirect("/kategori");
});

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    await model_kategori.delete(id);
    req.flash("success", "Kategori berhasil dihapus!");
    res.redirect("/kategori");
  } catch (err) {
    req.flash("error", "Gagal menghapus kategori.");
    res.redirect("/kategori");
  }
});


module.exports = router;
