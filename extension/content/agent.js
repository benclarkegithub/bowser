// Get all elements of interest
const elementsArray = [];

const elements = document.querySelectorAll("a, button, h1, h2, h3, h4, h5, h6, input, label, p, textarea");

elements.forEach((element, index) => {
    const elementTag = element.tagName.toLowerCase();

    // Add an ID to the element if it doesn't have one
    if (!element.id) {
        element.id = `${elementTag}-${index + 1}`;
    }

    // Parse the element as a string containing basic information
    const elementType = (element.type ? ` type="${element.type}"` : "");
    const elementValue = (element.value ? ` value="${element.value}"` : "");
    const elementStr = `<${elementTag} id="${element.id}"${elementType}${elementValue}>${element.textContent}</${elementTag}>`;
    
    // Add the string to the elements array
    elementsArray.push(elementStr);
});

console.log("elementsArray: ", elementsArray);

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.message === "content/agent/html") {
        // Send the page's HTML
        const elementsStr = elementsArray.join("\n");
        console.log("Sending HTML: ", elementsStr);
        sendResponse({ html: elementsStr });
	} else if (request.message = "content/agent/action") {
        // Execute an action on the page
        console.log("Executing action: ", request)

		if (request.action === "Click") {
			const id = request.id;
			Click(id);
		} else if (request.action === "Fill") {
			const id = request.id;
			const text = request.text;
			Fill(id, text);
		}

		function Click(id) {
			document.getElementById(id).click();
		}

		function Fill(id, text) {
			const element = document.getElementById(id);
			
            if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
				element.value = text;
			} else {
				console.error("Fill can only be used on text and textarea elements.");
			}
		}
	}
});
