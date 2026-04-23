var express = require("express");
const connection = require("../../config/database");
const model_kategori = require("../../model/model_kategori");

var router = express.Router();

/* GET home page */
router.get("/", async function (req, res, next) {
  let rows = await model_kategori.getAll();
  return res.status(200).json({
    status: "success",
    message: "Data berhasil diambil",
    data: rows,
  });
});

/* GET create form */
router.get("/create", async function (req, res, next) {
  try {
    let dataKategori = await model_kategori.getAll();

    res.render("kategori/create", {
      title: "CreateKategori",
      kategori: dataKategori,
    });
  } catch (err) {
    next(err);
  }
});

/* POST store data */
router.post("/store", async function (req, res, next) {
  try {
    let nama_kategori = req.body.nama_kategori;
    await model_kategori.store(nama_kategori);
    return res.status(200).json({
      status: "success",
      message: "Data berhasil ditambahkan",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menambahkan data",
    });
  }
});

/* GET edit form */
router.get("/edit/:id", function (req, res, next) {
  const id_kategori = req.params.id;
  model_kategori
    .getId(id_kategori)
    .then((data) => {
      res.status(200).json({
        status: "success",
        message: "Data berhasil diambil",
        data: data[0],
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

  if (!nama_kategori || nama_kategori.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Nama kategori tidak boleh kosong",
    });
  }
  let data = {
    nama_kategori: nama_kategori
  };
  try {
    await model_kategori.update(id, data);
    return res.status(200).json({
      status: "success",
      message: "Data berhasil diperbarui",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui data",
    });
  }
});

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    await model_kategori.delete(id);
    return res.status(200).json({
      status: "success",
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus data",
    });
  }
});

module.exports = router;
