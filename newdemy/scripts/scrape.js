const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const mongoose = require('mongoose');
const Course = require('../server/models/Course');
require('dotenv').config();

puppeteer.use(StealthPlugin());

async function scrapeUdemyCoupons() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  try {
    await page.goto('https://www.udemy.com/courses/free/', { waitUntil: 'networkidle2' });
    
    // Extract course data (adjust selectors based on Udemy's current structure)
    const courses = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('[data-purpose="course-card"]').forEach(card => {
        const title = card.querySelector('[data-purpose="course-title-url"]')?.textContent.trim();
        const url = card.querySelector('[data-purpose="course-title-url"]')?.href;
        const priceElements = card.querySelectorAll('[data-purpose="price-text"]');
        
        if (title && url && priceElements.length >= 2) {
          const originalPrice = parseFloat(priceElements[0].textContent.replace(/[^0-9.]/g, ''));
          const discountedPrice = parseFloat(priceElements[1].textContent.replace(/[^0-9.]/g, ''));
          const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
          
          items.push({
            title,
            url,
            originalPrice,
            discountedPrice,
            discountPercentage
          });
        }
      });
      return items;
    });

    // Save to database
    for (const course of courses) {
      // Extract coupon code from URL if possible
      const couponMatch = course.url.match(/(couponCode=|promoCode=)([^&]+)/);
      const couponCode = couponMatch ? couponMatch[2] : 'AUTO_' + Math.random().toString(36).substring(2, 8).toUpperCase();
      
      await Course.findOneAndUpdate(
        { url: course.url },
        {
          ...course,
          couponCode,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
        },
        { upsert: true, new: true }
      );
    }

    console.log(`Successfully scraped and saved ${courses.length} courses`);
  } catch (error) {
    console.error('Scraping error:', error);
  } finally {
    await browser.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

scrapeUdemyCoupons();