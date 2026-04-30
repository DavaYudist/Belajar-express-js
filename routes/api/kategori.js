var express = require("express");
const connection = require("../../config/database");
const model_kategori = require("../../model/model_kategori");
const verifyToken = require('../../config/middlewares/jwt');

var router = express.Router();


router.get("/", verifyToken, async function (req, res, next) {
  try {
    let rows = await model_kategori.getAll();
    return res.status(200).json({
      status: "success",
      message: "Data berhasil diambil",
      data: rows,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function(req, res, next) {
  try {
    let id = req.params.id;
    let data = await model_kategori.getId(id);

    if (data.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Data berhasil diambil",
        data: data[0],
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

/**
 * 3. POST STORE DATA
 */
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

/**
 * 4. POST UPDATE DATA
 */
router.post("/update/:id", async function (req, res, next) {
  let id = req.params.id;
  let nama_kategori = req.body.nama_kategori;

  if (!nama_kategori || nama_kategori.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Nama kategori tidak boleh kosong",
    });
  }

  try {
    let data = { nama_kategori: nama_kategori };
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

/**
 * 5. GET DELETE DATA
 */
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