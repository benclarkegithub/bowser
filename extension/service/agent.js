chrome.runtime.onMessage.addListener(async (request, _, __) => {
	if (request.message === "service/agent") {
		// Construct a prompt from the HTML and instructions, get a response, and send actions
		const html = request.html;
		const instructions = request.instructions;

        // Prompt
		let prompt = "The page's HTML is:\n\n";
		prompt += html + "\n\n";
		prompt += "The user's instructions are:\n\n";
		prompt += instructions;
		console.log("Sending prompt: ", prompt)

        // Response
		const response = await fetch('http://localhost:8000/get-actions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: prompt
			})
		});
		console.log("Received response: ", response);

        // Actions
		const actionsText = await response.text();
		doActions(actionsText);
	}
});

async function doActions(actionsText) {
    // Parse the actions and send them to the agent
	const actions = actionsText.split("\n");
	console.log("Split actions: ", actions);

	const tabsQuery = await chrome.tabs.query({ active: true, currentWindow: true });
	const activeTab = tabsQuery[0];

    const outputs = [];

	for (let action of actions) {
		// Regular expressions for each action
		const clickRegex = /Click\("([^"]+)"\)/;
		const fillRegex = /Fill\("([^"]+)", "([^"]+)"\)/;
		const outputRegex = /Output\("([^"]+)"\)/;

		// Parse the action and send them to the agent content script
		let match;

		if (match = action.match(clickRegex)) {
			const id = match[1];
			chrome.tabs.sendMessage(activeTab.id, { message: "content/agent/action", action: "Click", id: id });
			console.log(`Click action on element with id: ${id}`);
		} else if (match = action.match(fillRegex)) {
			const id = match[1];
			const text = match[2];
            chrome.tabs.sendMessage(activeTab.id, { message: "content/agent/action", action: "Fill", id: id, text: text });
			console.log(`Fill action on element with id: ${id} with text: ${text}`);
		} else if (match = action.match(outputRegex)) {
			const text = match[1];
			outputs.push(text);
			console.log(`Outputting message for the user: ${text}`);
		} else {
            console.error(`Unrecognised action: ${action}`);
        }
	}

    if (outputs.length) {
        // There was output, send to the popup
        const output = outputs.join("\n\n");
        chrome.runtime.sendMessage({ message: "popup/popup", output: output });
    }
}
