// Save XPath to history
function saveXPathToHistory(xpath, csharpCode) {
    const STORAGE_KEY = 'xpathClickerHistory';
    const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');

    // Add new entry to the history
    history.push({
        xpath: xpath,
        csharpCode: csharpCode,
        timestamp: Date.now()
    });

    // Save back to session storage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    // Update the display
    displayXPathHistory();
}

// Display XPath history on the main page
function displayXPathHistory() {
    const STORAGE_KEY = 'xpathClickerHistory';
    const historyContainer = document.getElementById('xpath-history');
    const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');

    if (historyContainer === null) {
        console.error("Element with id 'xpath-history' not found.");
        return;
    }

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No XPaths recorded yet.</p>';
        return;
    }

    historyContainer.innerHTML = '';
    history.reverse().forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'xpath-entry';
        entryDiv.innerHTML = `
            <strong>XPath:</strong> <code>${entry.xpath}</code>
            <button class="copy-btn" onclick="copyToClipboard('${entry.xpath}')">Copy XPath</button><br>
            <strong>C# Code:</strong><br>
            <code>${entry.csharpCode}</code>
            <button class="copy-btn" onclick="copyToClipboard('${entry.csharpCode}')">Copy C# Code</button><br>
            <small>Recorded: ${new Date(entry.timestamp).toLocaleString()}</small>
        `;
        historyContainer.appendChild(entryDiv);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayXPathHistory();
});
