// Fighter Data
const fighters = [
    {
        "id": 1,
        "name": "Giorgi Vatsadze",
        "nickname": "THE BULL",
        "rank": "Champion",
        "record": "17-4-0",
        "stats": {
            "wins": 17,
            "losses": 4,
            "knockouts": 15,
            "submissions": 0,
            "decisions": 2
        },
        "image": "4.png",
        "bio": "Known for his devastating knockout power, THE BULL charges through opponents with relentless aggression. 15 of his 17 wins came by way of knockout, often in the first round. His signature move is the overhand right that has put many fighters to sleep."
    },
    {
        "id": 2,
        "name": "Luka Gurwishvili",
        "nickname": "OSSETIAN WARRIOR",
        "rank": 3,
        "record": "5-3-0",
        "stats": {
            "wins": 5,
            "losses": 3,
            "knockouts": 5,
            "submissions": 0,
            "decisions": 0
        },
        "image": "1.png",
        "bio": "A pure striker with knockout power in both hands. The OSSETIAN WARRIOR never backs down from a brawl and has finished all his wins by knockout. His aggressive style makes him a fan favorite."
    },
    {
        "id": 3,
        "name": "Nika Kopaliani",
        "nickname": "Nikita",
        "rank": 2,
        "record": "7-4-0",
        "stats": {
            "wins": 7,
            "losses": 4,
            "knockouts": 5,
            "submissions": 0,
            "decisions": 2
        },
        "image": "fighter3.jpg",
        "bio": "Technical striker with precision timing and footwork. Nikita picks apart opponents with surgical striking and has a knack for finding knockout opportunities in later rounds. His calm demeanor in the cage contrasts with his violent finishes."
    },
    {
        "id": 4,
        "name": "Saba Boyoveli",
        "nickname": "THE EAGLE",
        "rank": 1,
        "record": "9-5-0",
        "stats": {
            "wins": 9,
            "losses": 5,
            "knockouts": 9,
            "submissions": 0,
            "decisions": 0
        },
        "image": "2.png",
        "bio": "Pure knockout artist with 9 first-round finishes. THE EAGLE soars through opponents with lightning-fast combinations and explosive power. His fights rarely see the second round."
    },
    {
        "id": 5,
        "name": "Dachi Gvaladze",
        "nickname": "THE CAVEMAN",
        "rank": 4,
        "record": "7-5-0",
        "stats": {
            "wins": 7,
            "losses": 5,
            "knockouts": 7,
            "submissions": 0,
            "decisions": 0
        },
        "image": "8.png",
        "bio": "Brute strength and raw power define THE CAVEMAN. He overwhelms opponents with relentless pressure and earth-shaking power in both hands. All wins by knockout, often in devastating fashion."
    },
    {
        "id": 6,
        "name": "Luka Shergelashvili",
        "nickname": "DARKNESS",
        "rank": 6,
        "record": "6-4-0",
        "stats": {
            "wins": 6,
            "losses": 4,
            "knockouts": 4,
            "submissions": 0,
            "decisions": 2
        },
        "image": "7.png",
        "bio": "Methodical and calculated, DARKNESS drags opponents into deep waters and drowns them with pressure. Excellent cardio and granite chin allow him to push a punishing pace."
    },
    {
        "id": 7,
        "name": "Giorgi Kvaratskhelia",
        "nickname": "BIG BOY",
        "rank": 7,
        "record": "5-4-0",
        "stats": {
            "wins": 5,
            "losses": 4,
            "knockouts": 4,
            "submissions": 0,
            "decisions": 1
        },
        "image": "3.jpg",
        "bio": "Massive heavyweight with surprising speed for his size. BIG BOY uses his reach effectively and has thunderous power in his hands. When he connects, opponents don't get back up."
    },
    {
        "id": 8,
        "name": "Akaki Tsabria",
        "nickname": "ICE COLD",
        "rank": 5,
        "record": "5-2-0",
        "stats": {
            "wins": 5,
            "losses": 2,
            "knockouts": 3,
            "submissions": 0,
            "decisions": 2
        },
        "image": "6.png",
        "bio": "Technical counter-striker with ice in his veins. ICE COLD remains calm under pressure and picks apart aggressive opponents. His precise timing leads to beautiful knockout finishes."
    }
];

// Current matchup and event state
let currentMatch = {
    fighter1: null,
    fighter2: null,
    votes1: 0,
    votes2: 0,
    eventTime: null
};

// DOM Elements
const championEl = document.getElementById('champion');
const rankingsEl = document.getElementById('rankings');
const statsGridEl = document.getElementById('statsGrid');
const fighter1El = document.getElementById('fighter1');
const fighter2El = document.getElementById('fighter2');
const voteBtn1 = document.getElementById('vote1');
const voteBtn2 = document.getElementById('vote2');
const bloodCount1 = document.getElementById('bloodCount1');
const bloodCount2 = document.getElementById('bloodCount2');
const bloodBar1 = document.getElementById('bloodBar1');
const bloodBar2 = document.getElementById('bloodBar2');
const eventTitle = document.getElementById('event-title');
let countdownInterval = null;

// Fetch fighters from API
async function fetchFighters() {
    try {
        const response = await fetch('/api/fighters');
        return await response.json();
    } catch (error) {
        console.error('Error fetching fighters:', error);
        return fighters; // Fallback to local data
    }
}

// Initialize Page
async function initPage() {
    // Load saved event from localStorage if available
    const savedEvent = JSON.parse(localStorage.getItem('bloodsportEvent'));
    
    if (savedEvent && savedEvent.eventTime) {
        const eventTime = new Date(savedEvent.eventTime);
        const now = new Date();
        
        // Only use saved event if it's still valid (not expired)
        if (eventTime > now) {
            currentMatch = {
                ...savedEvent,
                eventTime: eventTime
            };
            
            // Load the saved matchup
            loadMatchup();
            startCountdown();
        } else {
            // Event has expired - schedule a new one
            scheduleWeeklyEvent();
        }
    } else {
        // First load - schedule new event
        scheduleWeeklyEvent();
    }
    
    // Load saved votes if available
    const savedVotes = JSON.parse(localStorage.getItem('bloodsportVotes'));
    if (savedVotes) {
        currentMatch.votes1 = savedVotes.votes1 || 0;
        currentMatch.votes2 = savedVotes.votes2 || 0;
        updateVoteDisplay();
    }
    
    // Load the rest of the page
    loadChampion();
    loadRankings();
    loadStats();
    setupVoting();
}

// Cover Image Removal
function initCover() {
    const cover = document.getElementById('cover-screen');
    
    setTimeout(() => {
        cover.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => cover.remove(), 1000);
    }, 3000);
    
    cover.addEventListener('click', () => {
        cover.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => cover.remove(), 500);
    });
}

// Generate random match
function generateRandomMatch() {
    const rankedFighters = fighters.filter(f => f.rank !== "Champion");
    const shuffled = [...rankedFighters].sort(() => Math.random() - 0.5);
    
    let fighter1, fighter2;
    do {
        fighter1 = shuffled[0];
        fighter2 = shuffled[1];
    } while (fighter1.id === fighter2.id);
    
    return { fighter1, fighter2, votes1: 0, votes2: 0 };
}

// Get next Friday 6 PM Georgian Time (GMT+4)
function getNextFriday6PM() {
    const now = new Date();
    const georgianOffset = 4 * 60 * 60000; // GMT+4 in milliseconds
    const localTime = now.getTime();
    const georgianTime = localTime + (now.getTimezoneOffset() * 60000) + georgianOffset;
    const geoNow = new Date(georgianTime);
    
    // Calculate days until Friday (5)
    let daysUntilFriday = 5 - geoNow.getDay();
    if (daysUntilFriday < 0) daysUntilFriday += 7;
    
    // If today is Friday and before 18:00
    if (daysUntilFriday === 0 && geoNow.getHours() < 18) {
        daysUntilFriday = 0;
    } else if (daysUntilFriday === 0) {
        daysUntilFriday = 7;
    }
    
    // Create next Friday at 18:00 Georgian Time
    const nextFriday = new Date(geoNow);
    nextFriday.setDate(geoNow.getDate() + daysUntilFriday);
    nextFriday.setHours(18, 0, 0, 0);
    
    // Convert back to local time for countdown
    const localEventTime = new Date(nextFriday.getTime() - (now.getTimezoneOffset() * 60000) - georgianOffset);
    return localEventTime;
}

// Schedule weekly event
function scheduleWeeklyEvent() {
    // Clear existing countdown
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Get next event time (Friday 6 PM Georgian Time)
    const eventTime = getNextFriday6PM();
    
    // Generate random match
    const newMatch = generateRandomMatch();
    currentMatch = {
        ...newMatch,
        eventTime: eventTime
    };
    
    // Save to localStorage
    saveEventToStorage();
    
    // Update UI
    loadMatchup();
    startCountdown();
    
    // Update event title
    eventTitle.textContent = `${newMatch.fighter1.name} vs ${newMatch.fighter2.name}`;
}

// Save event to localStorage
function saveEventToStorage() {
    localStorage.setItem('bloodsportEvent', JSON.stringify({
        ...currentMatch,
        eventTime: currentMatch.eventTime.toISOString()
    }));
}

// Reset voting
function resetVoting() {
    currentMatch.votes1 = 0;
    currentMatch.votes2 = 0;
    localStorage.removeItem('bloodsportVotes');
    localStorage.setItem('bloodsportVoted', 'false');
    updateVoteDisplay();
}

// Load Champion Card
function loadChampion() {
    const champ = fighters.find(f => f.rank === "Champion");
    if (!champ) return;
    
    championEl.innerHTML = `
        <div class="fighter-info">
            <h2>👑 ${champ.name}</h2>
            <p class="nickname">"${champ.nickname}"</p>
            <p class="record">${champ.record}</p>
        </div>
        <div class="fighter-stats">
            <div>
                <div class="stat-value">${champ.stats.knockouts}</div>
                <div class="stat-label">KOs</div>
            </div>
            <div>
                <div class="stat-value">${champ.stats.submissions}</div>
                <div class="stat-label">SUBS</div>
            </div>
            <div>
                <div class="stat-value">${champ.stats.decisions}</div>
                <div class="stat-label">DEC</div>
            </div>
        </div>
    `;
}

// Load Rankings
function loadRankings() {
    const rankedFighters = fighters
        .filter(f => f.rank !== "Champion")
        .sort((a, b) => a.rank - b.rank);
    
    rankingsEl.innerHTML = rankedFighters.map(fighter => `
        <a href="fighter.html?id=${fighter.id}" class="fighter-rank-card">
            <div class="rank-number">#${fighter.rank}</div>
            <div class="fighter-details">
                <h3>${fighter.name}</h3>
                <p>${fighter.record}</p>
            </div>
        </a>
    `).join('');
}

// Load Stats
function loadStats() {
    const totalFights = fighters.reduce((sum, f) => sum + f.stats.wins + f.stats.losses, 0);
    const totalKOs = fighters.reduce((sum, f) => sum + f.stats.knockouts, 0);
    const totalSubs = fighters.reduce((sum, f) => sum + f.stats.submissions, 0);
    const totalDec = fighters.reduce((sum, f) => sum + f.stats.decisions, 0);
    
    statsGridEl.innerHTML = `
        <div class="stat-card">
            <h3>TOTAL FIGHTERS</h3>
            <div class="stat-value">${fighters.length}</div>
            <div class="stat-label">IN THE ROSTER</div>
        </div>
        <div class="stat-card">
            <h3>TOTAL FIGHTS</h3>
            <div class="stat-value">${totalFights}</div>
            <div class="stat-label">RECORDED</div>
        </div>
        <div class="stat-card">
            <h3>KNOCKOUTS</h3>
            <div class="stat-value">${totalKOs}</div>
            <div class="stat-label">TOTAL KOs</div>
        </div>
        <div class="stat-card">
            <h3>SUBMISSIONS</h3>
            <div class="stat-value">${totalSubs}</div>
            <div class="stat-label">TOTAL SUBS</div>
        </div>
    `;
}

// Load Matchup
function loadMatchup() {
    fighter1El.innerHTML = `
        <div class="fighter-image" style="background-image: url('${currentMatch.fighter1.image}')"></div>
        <div class="fighter-info">
            <h3 class="fighter-name">${currentMatch.fighter1.name}</h3>
            <p class="fighter-record">${currentMatch.fighter1.record}</p>
            <p class="fighter-nickname">"${currentMatch.fighter1.nickname}"</p>
        </div>
    `;
    
    fighter2El.innerHTML = `
        <div class="fighter-image" style="background-image: url('${currentMatch.fighter2.image}')"></div>
        <div class="fighter-info">
            <h3 class="fighter-name">${currentMatch.fighter2.name}</h3>
            <p class="fighter-record">${currentMatch.fighter2.record}</p>
            <p class="fighter-nickname">"${currentMatch.fighter2.nickname}"</p>
        </div>
    `;
    
    eventTitle.textContent = `${currentMatch.fighter1.name} vs ${currentMatch.fighter2.name}`;
    updateVoteDisplay();
}

// Setup Voting
function setupVoting() {
    voteBtn1.addEventListener('click', (e) => castVote(1, e));
    voteBtn2.addEventListener('click', (e) => castVote(2, e));
}

// Create blood splatter effect
function createBloodSplatter(x, y) {
    const splatter = document.createElement('div');
    splatter.className = 'vote-splatter';
    splatter.style.left = `${x}px`;
    splatter.style.top = `${y}px`;
    document.body.appendChild(splatter);
    
    setTimeout(() => splatter.remove(), 800);
}

// Cast Vote
function castVote(fighter, event) {
    const hasVoted = localStorage.getItem('bloodsportVoted') === 'true';
    if (hasVoted) {
        alert("You've already voted for this matchup!");
        return;
    }
    
    createBloodSplatter(event.clientX, event.clientY);
    
    if (fighter === 1) currentMatch.votes1++;
    else currentMatch.votes2++;
    
    localStorage.setItem('bloodsportVoted', 'true');
    localStorage.setItem('bloodsportVotes', JSON.stringify({
        votes1: currentMatch.votes1,
        votes2: currentMatch.votes2
    }));
    
    updateVoteDisplay();
}

// Update Vote Display
function updateVoteDisplay() {
    bloodCount1.textContent = currentMatch.votes1;
    bloodCount2.textContent = currentMatch.votes2;
    
    const totalVotes = currentMatch.votes1 + currentMatch.votes2;
    const percent1 = totalVotes > 0 ? (currentMatch.votes1 / totalVotes) * 100 : 50;
    const percent2 = totalVotes > 0 ? (currentMatch.votes2 / totalVotes) * 100 : 50;
    
    bloodBar1.style.width = `${percent1}%`;
    bloodBar2.style.width = `${percent2}%`;
}

// Event Countdown Timer
function startCountdown() {
    const eventDate = currentMatch.eventTime.getTime();
    
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "<div>FIGHT STARTED!</div>";
            
            // Schedule next weekly event after 10 seconds
            setTimeout(() => {
                resetVoting();
                scheduleWeeklyEvent();
            }, 10000);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCover();
    initPage();
});