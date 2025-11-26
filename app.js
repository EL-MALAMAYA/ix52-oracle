// Application state
let currentCard = null;
let stabilityOpen = false;

// DOM Elements
const suitSelect = document.getElementById('suitSelect');
const rankSelect = document.getElementById('rankSelect');
const randomBtn = document.getElementById('randomBtn');
const selectedCardLabel = document.getElementById('selectedCardLabel');
const welcomeMessage = document.getElementById('welcomeMessage');
const notFoundMessage = document.getElementById('notFoundMessage');
const cardView = document.getElementById('cardView');
const toast = document.getElementById('toast');

// Event Listeners
suitSelect.addEventListener('change', handleCardSelection);
rankSelect.addEventListener('change', handleCardSelection);
randomBtn.addEventListener('click', selectRandomCard);

// Handle card selection
function handleCardSelection() {
    const suit = suitSelect.value;
    const rank = rankSelect.value;
    
    if (!suit || !rank) {
        showWelcome();
        return;
    }
    
    // Find the card
    const card = ORACLE_CARDS.find(c => c.suit === suit && c.rank === rank);
    
    if (!card) {
        showNotFound();
        return;
    }
    
    currentCard = card;
    displayCard(card);
}

// Select random card
function selectRandomCard() {
    const randomIndex = Math.floor(Math.random() * ORACLE_CARDS.length);
    const card = ORACLE_CARDS[randomIndex];
    
    // Update selectors
    suitSelect.value = card.suit;
    rankSelect.value = card.rank;
    
    currentCard = card;
    displayCard(card);
}

// Show welcome message
function showWelcome() {
    welcomeMessage.classList.remove('hidden');
    notFoundMessage.classList.add('hidden');
    cardView.classList.add('hidden');
    selectedCardLabel.textContent = '';
}

// Show not found message
function showNotFound() {
    welcomeMessage.classList.add('hidden');
    notFoundMessage.classList.remove('hidden');
    cardView.classList.add('hidden');
    selectedCardLabel.textContent = '';
}

// Display card
function displayCard(card) {
    // Hide messages
    welcomeMessage.classList.add('hidden');
    notFoundMessage.classList.add('hidden');
    
    // Update selected card label
    selectedCardLabel.textContent = `Today's card: ${card.card_label}`;
    
    // Card title
    document.getElementById('cardTitle').textContent = card.card_label;
    
    // Element chip with color
    const elementChip = document.getElementById('elementChip');
    elementChip.textContent = card.element;
    elementChip.className = 'chip';
    
    // Add element-specific class
    switch(card.element) {
        case 'Water':
            elementChip.classList.add('element-water');
            break;
        case 'Earth':
            elementChip.classList.add('element-earth');
            break;
        case 'Fire':
            elementChip.classList.add('element-fire');
            break;
        case 'Air':
            elementChip.classList.add('element-air');
            break;
    }
    
    // Other chips
    document.getElementById('verbesqueChip').textContent = card.verbesque_verb;
    document.getElementById('directionChip').textContent = card.direction;
    
    // Lucky number badge
    document.getElementById('luckyNumberBadge').textContent = card.lucky_number;
    
    // Color swatch
    const colorHex = getColorHex(card.color);
    document.getElementById('colorSwatch').style.backgroundColor = colorHex;
    document.getElementById('colorName').textContent = card.color;
    
    // Theme chips
    document.getElementById('suitThemeChip').textContent = card.suit_theme;
    document.getElementById('rankArchetypeChip').textContent = card.rank_archetype;
    
    // Oracle & Quote
    document.getElementById('oracleText').textContent = card.oracle_text;
    document.getElementById('quoteText').textContent = card.quote;
    
    // Daily Practice
    document.getElementById('mantraText').textContent = card.mantra;
    document.getElementById('tinyActionText').textContent = card.tiny_action;
    document.getElementById('journalPromptText').textContent = card.journal_prompt;
    document.getElementById('bodyCueText').textContent = card.body_cue;
    
    // Verbesque
    document.getElementById('verbesqueVerb').textContent = card.verbesque_verb;
    document.getElementById('verbesqueCue').textContent = card.verbesque_cue;
    
    // Word & Trivia
    document.getElementById('wordOfDay').textContent = card.word_of_the_day;
    document.getElementById('wordMeaning').textContent = card.word_meaning;
    document.getElementById('triviaText').textContent = card.trivia;
    
    // Parse trivia source for link
    const triviaSourceEl = document.getElementById('triviaSource');
    const sourceMatch = card.trivia_source.match(/(.+?)\s*—\s*(https?:\/\/.+)/);
    if (sourceMatch) {
        const [, sourceName, sourceUrl] = sourceMatch;
        triviaSourceEl.innerHTML = `Source: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${sourceName}</a>`;
    } else {
        triviaSourceEl.textContent = `Source: ${card.trivia_source}`;
    }
    
    // Stability check
    document.getElementById('stabilityText').textContent = card.bipolar_self_check;
    
    // Reset stability section to collapsed
    stabilityOpen = false;
    document.getElementById('stabilityContent').classList.add('hidden');
    document.getElementById('toggleStabilityBtn').textContent = 'Show';
    
    // Show card view with animation
    cardView.classList.remove('hidden');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle stability check section
function toggleStability() {
    stabilityOpen = !stabilityOpen;
    const content = document.getElementById('stabilityContent');
    const btn = document.getElementById('toggleStabilityBtn');
    
    if (stabilityOpen) {
        content.classList.remove('hidden');
        btn.textContent = 'Hide';
    } else {
        content.classList.add('hidden');
        btn.textContent = 'Show';
    }
}

// Copy to clipboard functionality
function copyToClipboard(type) {
    if (!currentCard) return;
    
    let text = '';
    
    switch(type) {
        case 'mantra':
            text = currentCard.mantra;
            break;
        case 'journal':
            text = currentCard.journal_prompt;
            break;
        case 'quote':
            text = currentCard.quote;
            break;
        case 'all':
            text = `${currentCard.card_label}\n\n`;
            text += `MANTRA\n${currentCard.mantra}\n\n`;
            text += `TINY ACTION\n${currentCard.tiny_action}\n\n`;
            text += `JOURNAL PROMPT\n${currentCard.journal_prompt}\n\n`;
            text += `BODY CUE\n${currentCard.body_cue}`;
            break;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    });
}

// Show toast notification
function showToast() {
    toast.classList.remove('hidden');
    toast.classList.add('toast');
    
    setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('toast');
    }, 2000);
}

// Dark mode toggle (now defaults to dark, toggles to light)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    
    // Update icon
    const icon = isLight ? '☀️' : '🌙';
    document.getElementById('toggleIcon').textContent = icon;
    document.getElementById('darkModeLabel').textContent = isLight ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('lightMode', isLight ? 'enabled' : 'disabled');
}

// Load light mode preference
function loadDarkModePreference() {
    const lightMode = localStorage.getItem('lightMode');
    if (lightMode === 'enabled') {
        document.body.classList.add('light-mode');
        document.getElementById('toggleIcon').textContent = '☀️';
        document.getElementById('darkModeLabel').textContent = '☀️';
    }
}

// Initialize app
function init() {
    console.log(`IX:52 Oracle loaded with ${ORACLE_CARDS.length} cards`);
    loadDarkModePreference();
}

// Run on page load
init();

