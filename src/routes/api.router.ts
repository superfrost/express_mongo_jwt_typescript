const express = require('express')
const router = express.Router()
import userController  from '../controllers/user.controller';
import isAuth from '../middlewares/isAuth';
import { body } from 'express-validator';

router.post("/healthcheck", userController.healthcheck)

router.post("/login", 
            body("email").isEmail().normalizeEmail(),
            body("login").not().isEmpty().trim().escape(),  
            userController.login)

router.post('/register', 
            body("email").isEmail().normalizeEmail(),
            body("login").not().isEmpty().trim().escape(),
            body("password").isLength({min: 4, max: 20}).withMessage('must be at least 4 chars long and ho longer than 20 chars'),
            userController.register)

// Receive ownerid (optional), page, maxcount
router.get('/get-photos', userController.getPhotos)

router.use(isAuth)

router.get('/load-photos', userController.loadPhotos)

// Receive photoid (or multiple ids separated by comma)
router.delete('/delete-photo', userController.deletePhoto)

// Receive albumid (or multiple ids separated by comma)
router.delete('/delete-album', userController.deleteAlbum)

// Receive albumid, new_album_name
router.post('/change-album-title', userController.changeAlbumTitle)

export = router