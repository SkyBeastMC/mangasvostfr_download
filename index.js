const puppeteer = require('puppeteer')

async function main() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	async function scrapEmbeds() {
		return await page.evaluate(() => {
			const names = document.querySelector('.su-tabs-nav')
			const contents = document.querySelector('.su-tabs-panes')
			return {
				embeds: Array.from(names.children).map(child => child.innerText),
				links: Array.from(contents.children).map(child => child.firstChild.dataset.lazySrc)
			}
		})
	}

	async function goNext() {
		const link = await page.evaluate(() => {
			const a = document.querySelector('.nextor').firstChild
			return a && a.href
		})
		if (link) {
			await page.goto(link)
			await page.waitForSelector('.thecontent')
		}
		return link
	}

	page.goto('http://www.mangas-vostfr.pro/no-game-no-life-01-vostfr-ng0/')
	await page.waitForSelector('.thecontent')

	const episodes = []

	do {
		episodes.push(await scrapEmbeds())
	} while (await goNext())

	console.log(episodes)
	await browser.close()
}

main().catch(console.log)

