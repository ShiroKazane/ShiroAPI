const express = require('express');
const router = express.Router();
const https = require('https');
const fetch = require('node-fetch');

router.get('/avatar/:username', async (req, res) => {
    try {
        const size = req.query.size;
        const username = req.params.username;
        const { id } = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`).then((res) => res.json());
        const avatar = `https://crafatar.com/avatars/${id}?size=${size || '32'}&overlay`;
        https.get(avatar, (response) => {
            response.pipe(res);
        });
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
        https.get(icon, (response) => {
            response.pipe(res);
        });
    } catch (err) {
        console.error(err);
        res.status(404).render('4xx/404');
    }
});

module.exports = router;