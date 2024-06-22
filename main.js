let settings = {
    urls: [
        "https://kaniberk.com",
        "https://fasttyping.com.tr",
    ],
    delay: 500,
    retries: 3,
    delayPerProcess: 1000,
    XPaths: {
        newRequestButton: "//span[@id='rMvdld']/div/div/div/div/div/div[2]/div/span/span",
        input: "//span[@id='efi49d']/div[2]/label/input",
        submitButton: "//div[@id='yDmH0d']/div[6]/div/div[2]/div[3]/div[2]/span/span",
        closeButton: "//*[@id='yDmH0d']/div[6]/div/div[2]/div[3]/div",
    }
};

const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
const retry = async (fn, retries = settings.retries) => {
    for (let attempt = 1; attempt <= retries; attempt++)
    {
        try
        {
            await fn();
            return;
        } catch (e)
        {
            console.log(`Attempt ${attempt} failed:`, e);
            if (attempt < retries)
                await sleep(settings.delay);
            else
                console.log('All attempts failed');
        }
    }
}

const performActionsForUrl = async (url) => {
    await retry(async () => {
        console.log("Trying to click on new request button...");
        const firstElement = document.evaluate(settings.XPaths.newRequestButton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (firstElement) {
            firstElement.click();
        } else {
            throw new Error("New Request Button not found");
        }
    });
    await sleep(settings.delay);

    await retry(async () => {
        console.log("Trying to input on click...");
        const secondElement = document.evaluate(settings.XPaths.input, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (secondElement) {
            secondElement.click();
        } else {
            throw new Error("Input not found");
        }
    });
    await sleep(settings.delay);

    await retry(async () => {
        console.log("Trying to input on value...");
        var inputElement = document.evaluate(settings.XPaths.input, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (inputElement) {
            inputElement.value = url;
            var event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);
        } else {
            throw new Error("Input not found");
        }
    });
    await sleep(settings.delay);

    await retry(async () => {
        console.log("Trying to click on submit button...");
        const submitButton = document.evaluate(settings.XPaths.submitButton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (submitButton) {
            submitButton.click();
        } else {
            throw new Error("Submit button not found");
        }
    });
    await sleep(settings.delay);

    await retry(async () => {
        console.log("Trying to click on submit button again...");
        const submitButtonAgain = document.evaluate(settings.XPaths.submitButton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (submitButtonAgain) {
            submitButtonAgain.click();
        } else {
            throw new Error("Submit button again not found");
        }
    });
    await sleep(settings.delay);

    await retry(async () => {
        console.log("Trying to click on close button...");
        const firstElement = document.evaluate("//*[@id='yDmH0d']/div[6]/div/div[2]/div[3]/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (firstElement) {
            firstElement.click();
            console.log("URL could not be removed, it may have already been removed");
        } else {
            throw new Error("Url successfully removed");
        }
    });
    await sleep(settings.delay);
}

const run = async () => {
    let i = 0;
    for (const url of settings.urls) {
        console.log(`Processing URL: ${url}`);
        await performActionsForUrl(url);
        i++;
        console.log('Processing Done ' + i + " / " + settings.urls.length);
        await sleep(settings.delayPerProcess);
    }
    console.log("Processing İs Completed Successfully!");
}

run();
