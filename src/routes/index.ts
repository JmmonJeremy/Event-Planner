// src/routes/index.ts
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Example endpoint
 *     description: Returns an example response.
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/example', (req, res) => {
    res.json({ message: 'Example endpoint' });
});

export default router;
