document.getElementById("submit").addEventListener("click", async () => {
    // Get HTML and instructions and send to the agent
    // Activate bowser
    document.getElementById("bowser").src = "bowser.gif";

    const tabsQuery = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabsQuery[0];

    // Get the page's HTML
    const response = await chrome.tabs.sendMessage(activeTab.id, { message: "content/agent/html" });
    const html = response.html;

    // Get the user's instructions
    const instructions = document.getElementById("instructions").value;

    // Send HTML and instructions to the agent service worker
    chrome.runtime.sendMessage({ message: "service/agent", html: html, instructions: instructions });
});

chrome.runtime.onMessage.addListener(async (request, _, __) => {
    if (request.message === "popup/popup") {
        // Add output
        const output = request.output;

        const outputElement = document.getElementById("output");
        outputElement.style.display = "block";
        outputElement.value = output;
    }
});
