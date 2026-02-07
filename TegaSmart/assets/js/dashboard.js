// Load user data and tickets
document.addEventListener('DOMContentLoaded', () => {
    // Mock user data (will come from PHP later)
    const user = {
        name: "John Doe",
        phone: "+250788123456",
        balance: "15,000 RWF",
        cardId: "RFID-ABC123"
    };
    
    // Display user info
    document.getElementById('userInfo').innerHTML = `
        <div class="user-card">
            <h3>👤 ${user.name}</h3>
            <p>Phone: ${user.phone}</p>
            <p>Card: ${user.cardId}</p>
            <p class="balance">Balance: <strong>${user.balance}</strong></p>
            <button onclick="addFunds()" class="btn btn-primary">Add Funds</button>
        </div>
    `;
    
    // Load tickets from localStorage
    loadTickets();
});

function loadTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const container = document.getElementById('ticketsList');
    
    if (tickets.length === 0) {
        container.innerHTML = '<p class="no-tickets">No tickets purchased yet.</p>';
        return;
    }
    
    container.innerHTML = tickets.map(ticket => `
        <div class="ticket-card ${isExpired(ticket.expiryDate) ? 'expired' : 'active'}">
            <div class="ticket-header">
                <h4>${ticket.route}</h4>
                <span class="status">${isExpired(ticket.expiryDate) ? 'EXPIRED' : 'ACTIVE'}</span>
            </div>
            <p>Price: ${ticket.price}</p>
            <p>Purchased: ${ticket.purchaseDate}</p>
            <p>Expires: ${ticket.expiryDate}</p>
            ${!isExpired(ticket.expiryDate) ? 
                '<button onclick="useTicket(' + ticket.id + ')" class="btn btn-secondary">Use Ticket</button>' : ''}
        </div>
    `).join('');
}

function isExpired(expiryDate) {
    return new Date(expiryDate) < new Date();
}

function addFunds() {
    const amount = prompt("Enter amount to add (RWF):");
    if (amount && !isNaN(amount)) {
        alert(`Added ${amount} RWF to your balance (simulated)`);
    }
}

function useTicket(ticketId) {
    alert(`Ticket ${ticketId} scanned! Access granted. (Simulated)`);
}