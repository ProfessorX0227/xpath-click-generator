(function() {
    const STORAGE_KEY = 'xpathClickerHistory';

    function getXPath(element) {
        if (element.id !== '')
            return 'id("' + element.id + '")';
        if (element === document.body)
            return element.tagName.toLowerCase();

        var ix = 0;
        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element)
                return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                ix++;
        }
    }

    function createCSharpCode(xpath) {
        return `IWebElement element = driver.FindElement(By.XPath("${xpath}"));`;
    }

    function saveXPathToHistory(xpath, csharpCode) {
        let history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        history.push({ xpath, csharpCode, timestamp: new Date().toISOString() });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        displayXPathHistory();
    }

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        var xpath = getXPath(e.target);
        var csharpCode = createCSharpCode(xpath);
        saveXPathToHistory(xpath, csharpCode);
        return false;
    }

    function displayXPathHistory() {
        const historyContainer = document.getElementById('xpath-history');
        const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');

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

    // Attach the event listener to capture clicks
    document.body.addEventListener('click', handleClick, true);
})();
