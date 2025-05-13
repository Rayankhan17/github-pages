// Simplified version for beginners
const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting scraping...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto('https://www.discudemy.com/all');
  
  // Simple scraping logic
  const courses = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card')).map(card => {
      return {
        title: card.querySelector('.card-header')?.innerText.trim(),
        url: card.querySelector('a')?.href,
        price: card.querySelector('.price')?.innerText.trim()
      };
    }).filter(course => course.title && course.url);
  });
  
  console.log('Found courses:', courses);
  await browser.close();
  
  // Here you would normally save to database
  // For beginners, we'll just log the results
  require('fs').writeFileSync('courses.json', JSON.stringify(courses, null, 2));
  console.log('Saved to courses.json');
})();