import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());

app.get('/api/check', async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  const url = `https://claim.hyperlane.foundation/api/check-eligibility?address=${address}`;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    const json = await response.json();

    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
