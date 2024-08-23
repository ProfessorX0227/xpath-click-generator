// xpath-click-generator.js

// Function to handle clicks on elements and save XPath history
document.body.addEventListener('click', function (event) {
    // Prevent default action
    event.preventDefault();

    // Get the clicked element
    const element = event.target;

    // Generate XPath (this is a simple example, you may want to refine this)
    const xpath = getXPath(element);
    
    // Generate corresponding C# code (you can modify this to fit your needs)
    const csharpCode = generateCSharpCode(xpath);
    
    // Save XPath and C# code to history
    saveXPathToHistory(xpath, csharpCode);
});

// Function to generate XPath
function getXPath(element) {
    let xpath = '';
    while (element) {
        const tagName = element.tagName.toLowerCase();
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element) + 1; // XPath index starts at 1
        xpath = `${tagName}[${index}]${xpath ? '/' + xpath : ''}`;
        element = element.parentNode;
    }
    return '/' + xpath;
}

// Function to generate C# code from XPath
function generateCSharpCode(xpath) {
    return `var element = driver.FindElement(By.XPath("${xpath}"));`;
}

// Function to save XPath and C# code to history
function saveXPathToHistory(xpath, csharpCode) {
    const history = JSON.parse(localStorage.getItem('xpathClickerHistory') || '[]');
    history.push({
        xpath: xpath,
        csharpCode: csharpCode,
        timestamp: Date.now()
    });
    localStorage.setItem('xpathClickerHistory', JSON.stringify(history));
    displayXPathHistory();
}

// Function to display XPath history on the main page
function displayXPathHistory() {
    const historyContainer = document.getElementById('xpath-history');
    const history = JSON.parse(localStorage.getItem('xpathClickerHistory') || '[]');

    if (!historyContainer) {
        console.error("History container not found!");
        return;
    }

    // Clear previous entries
    historyContainer.innerHTML = '';

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No XPaths recorded yet.</p>';
        return;
    }

    history.forEach((entry) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'xpath-entry';
        entryDiv.innerHTML = `
            <strong>XPath:</strong> <code>${entry.xpath}</code>
            <button class="copy-btn" onclick="copyToClipboard('${entry.xpath}')">Copy XPath</button><br>
            <strong>C# Code:</strong><br>
            <code>${entry.csharpCode}</code>
            <button class="copy-btn" onclick="copyToClipboard('${entry.csharpCode}')">Copy C# Code</button><br>
            <small>Recorded: ${new Date(entry.timestamp).toLocaleString()}</small>
            <hr>
        `;
        historyContainer.appendChild(entryDiv);
    });

    // Set a timer to hide history after 20 seconds
    setTimeout(() => {
        historyContainer.innerHTML = '';
    }, 3000);
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Call this function when the script loads to display existing history
displayXPathHistory();
