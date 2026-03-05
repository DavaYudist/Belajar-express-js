var express = require('express');
const connection = require('../config/database');
var router = express.Router();

/* GET home page (MENANGKAP FLASH MESSAGE) */
router.get("/", function (req, res, next) {
    const query = "SELECT * FROM kategori";

    connection.query(query, function(err, result){
        if(err){
            console.error("ERORR : ", err);
            return res.status(500).send("Error database: " + err.message);
        }

        res.render("kategori/index", {
            title: "Halaman Kategori",
            kategori: result,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    });
});

/* GET create form */
router.get('/create', function(req, res, next) {
    res.render('kategori/create', { title: 'Tambah Kategori' });
});

/* POST store data */
router.post('/store', function(req, res, next) {
    const nama_kategori = req.body.nama_kategori;
    const query = "INSERT INTO kategori (nama_kategori) VALUES (?)";
    connection.query(query, [nama_kategori], function(err, result) {
        if (err) {
            console.error("ERROR : ", err);
            req.flash('error', 'Gagal menambah data.');
            return res.redirect('/kategori');
        } 
        req.flash('success', 'Data berhasil ditambahkan.');
        res.redirect("/kategori");
    });
});

/* GET edit form */
router.get('/edit/:id', function(req, res, next) {
    const id = req.params.id; 
    const query = "SELECT * FROM kategori WHERE id_kategori = ?"; 
    
    connection.query(query, [id], function(err, result) {
        if (err) {
            console.error("ERROR : ", err);
            return res.status(500).send("Terjadi kesalahan pada database.");
        } 
        
        if(result.length > 0) {
            res.render("kategori/edit", {
                title: "Ubah Data Kategori",
                kategori: result[0]
            });
        } else {
            res.redirect("/kategori");
        }
    });
});

/* POST update data */
router.post('/update/:id', function(req, res, next) {
    const id = req.params.id;
    const nama_kategori = req.body.nama_kategori;
    const query = "UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?";
    
    connection.query(query, [nama_kategori, id], function(err, result) {
        if (err) {
            console.error("ERROR : ", err);
            return res.status(500).send("Terjadi kesalahan pada database.");
        } 
        req.flash('success', 'Data kategori berhasil diupdate.');
        res.redirect("/kategori");
    });
});

router.get('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    const query = "DELETE FROM kategori WHERE id_kategori = ?";
    
    connection.query(query, [id], function(err, result) {
        if (err) {
            console.error("ERROR : ", err);
            req.flash('error', 'Gagal menghapus data.');
            return res.redirect("/kategori");
        } 
        req.flash('success', 'Data kategori berhasil dihapus.');
        res.redirect("/kategori");
    });
});

module.exports = router;