const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const getImage = require('../middleware/getImage');
const tempPath = `./src/temp`;

router.get('/avatar/:username', async (req, res) => {
    try {
        const size = req.query.size;
        const username = req.params.username;
        const { id } = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then((res) => res.json());
        const avatar = `https://crafatar.com/avatars/${id}?size=${size || '32'}&overlay`;
        const img = path.resolve(tempPath, `${id}-${size || '32'}.png`);
        await getImage(avatar, img);
        res.sendFile(img);
    } catch (err) {
        console.error(err);
        res.status(404).render('4xx/404');
    }
});

router.get('/icon/:username', async (req, res) => {
    try {
        const size = req.query.size;
        const username = req.params.username;
        const { id } = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then((res) => res.json());
        const icon = `https://visage.surgeplay.com/face/${size || '32'}/${id || 'X-Steve'}.png`;
        const img = path.resolve(tempPath, `${id || 'X-Steve'}-${size || '32'}.png`);
        await getImage(icon, img);
        res.sendFile(img);
    } catch (err) {
        console.error(err);
        res.status(404).render('4xx/404');
    }
});

module.exports = router;