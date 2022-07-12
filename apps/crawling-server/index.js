const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');    

const run = async () => {
  // 1. chromedriver 경로 설정
  // chromedriver가 있는 경로를 입력
    // const service = new chrome.ServiceBuilder('./chromedriver.exe').build();
    // chrome.setDefaultService(service);
    // 2. chrome 브라우저 빌드
    let driver = await new Builder()
    .forBrowser('chrome')    
    .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
    "lang=ko_KR"))
    .build();

    try {
        // 카카오맵 실행
        await driver.get('about:blank')
        await driver.executeScript("Object.defineProperty(navigator, 'plugins', {get: function() {return[1, 2, 3, 4, 5];},});")
        await driver.executeScript("Object.defineProperty(navigator, 'languages', {get: function() {return ['ko-KR', 'ko']}})")
        await driver.executeScript("const getParameter = WebGLRenderingContext.getParameter;WebGLRenderingContext.prototype.getParameter = function(parameter) {if (parameter === 37445) {return 'NVIDIA Corporation'} if (parameter === 37446) {return 'NVIDIA GeForce GTX 980 Ti OpenGL Engine';}return getParameter(parameter);};")
        console.log(await driver.findElement(By.css("user-agent")).getText)
        console.log(await driver.findElement(By.css("plugins-length")).getText)
        console.log(await driver.findElement(By.css("languages")).getText)
        console.log(await driver.findElement(By.css("webgl-vendor")).getText)
        console.log(await driver.findElement(By.css("webgl-renderer")).getText)

        await driver.get('https://map.kakao.com/');
        let userAgent = await driver.executeScript("return navigator.userAgent;")
        console.log('[UserAgent]', userAgent);

        // By.id로 #query Element를 얻어온다.
        let searchInput = await driver.findElement(By.id('search.keyword.query'));
        let keyword = "닭발";
        searchInput.sendKeys(keyword, Key.ENTER);

        // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
        await driver.wait(until.elementLocated(By.id('info.search.place.list')), 10000);
        let resultElements  = await driver.findElements(By.className("placetit"));

        console.log('[resultElements.length]', resultElements.length)
        for (var i = 0; i < resultElements.length; i++) {
            console.log('- ' + await resultElements[i].getCssValue())
        }

    }
    catch(e){
        console.log(e);
    }
    finally {
        driver.quit();
    }
}
run();

//https://jizard.tistory.com/227