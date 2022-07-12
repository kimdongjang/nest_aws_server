const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');    

const run = async () => {
    let driver = await new Builder()
    .forBrowser('chrome')    
    .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    "lang=ko_KR"))
    .build();

    try {
        // 특정 URL 생성
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

        // 검색한 elements 하위의 value를 출력함
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