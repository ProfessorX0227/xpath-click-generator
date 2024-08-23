// Function to generate XPath for a clicked element
function getXPath(element) {
    // Generate the XPath of the given element
    if (element.id) {
        return 'id("' + element.id + '")';
    }
    if (element === document.body) {
        return '/html/body';
    }

    const ix = Array.from(element.parentNode.children).indexOf(element) + 1;
    const tagName = element.tagName.toLowerCase();
    return getXPath(element.parentNode) + '/' + tagName + '[' + ix + ']';
}

// Inject the necessary HTML and functionality
(function() {
    // Create the history container
    var historyContainer = document.createElement('div');
    historyContainer.id = 'xpath-history';
    historyContainer.style.position = 'fixed';
    historyContainer.style.bottom = '10px';
    historyContainer.style.right = '10px';
    historyContainer.style.backgroundColor = '#fff';
    historyContainer.style.border = '1px solid #ccc';
    historyContainer.style.padding = '10px';
    historyContainer.style.zIndex = '9999';
    document.body.appendChild(historyContainer);

    // Load XPath history from local storage
    function displayXPathHistory() {
        const history = JSON.parse(localStorage.getItem('xpathClickerHistory') || '[]');

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No XPaths recorded yet.</p>';
            return;
        }

        historyContainer.innerHTML = '';
        history.forEach((entry) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'xpath-entry';
            entryDiv.innerHTML = `
                <strong>XPath:</strong> <code>${entry.xpath}</code>
                <button onclick="copyToClipboard('${entry.xpath}')">Copy XPath</button><br>
                <strong>C# Code:</strong><br>
                <code>${entry.csharpCode}</code>
                <button onclick="copyToClipboard('${entry.csharpCode}')">Copy C# Code</button><br>
                <small>Recorded: ${new Date(entry.timestamp).toLocaleString()}</small>
            `;
            historyContainer.appendChild(entryDiv);
        });
    }

    // Function to copy text to clipboard
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Call the display function to show existing history
    displayXPathHistory();

    // Save XPath when an element is clicked
    document.body.addEventListener('click', function(event) {
        // Prevent the click event from propagating further
        event.stopPropagation();

        var xpath = getXPath(event.target);
        var csharpCode = `driver.FindElement(By.XPath("${xpath}"));`; // Generate C# code

        // Save to local storage
        var history = JSON.parse(localStorage.getItem('xpathClickerHistory') || '[]');
        history.push({ xpath: xpath, csharpCode: csharpCode, timestamp: Date.now() });
        localStorage.setItem('xpathClickerHistory', JSON.stringify(history));

        // Update history display
        displayXPathHistory();
    });
})();
