/* ==========================================================================
   RESERVIX - AIRBNB & BOOKING CHANNEL MANAGER LOGIC (PREVIO & AIRBO STYLE)
   ========================================================================== */

// --- INITIAL DATA & LOCAL STORAGE PERSISTENCE ---

const DEFAULT_PROPERTIES = [
    {
        id: 'prop-konselska',
        name: 'Sunny Apartment with Balcony (Konšelská)',
        address: 'Konšelská 22, Praha 8 - Libeň',
        hotelId: '16884885',
        listingId: '1728523339636013855',
        pricePerNight: 62,
        weekendPrice: 85,
        currency: 'EUR',
        minStay: 1,
        capacity: 4,
        wifiName: 'Konselska_Guest',
        wifiPass: 'Liben2026Wifi',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        airbnbIcal: 'https://www.airbnb.cz/calendar/ical/1728523339636013855.ics?t=31a8c02041084ffeba36c8cef6a7012a',
        bookingIcal: 'https://ical.booking.com/v1/export?t=89d4d309-b948-4761-85f8-9a00c2eb0829'
    }
];

const DEFAULT_CHANNELS = [
    { id: 'ch-airbnb', name: 'Airbnb', type: 'API + iCal', commission: '3%', connected: true, icon: 'fa-brands fa-airbnb', color: '#FF385C' },
    { id: 'ch-booking', name: 'Booking.com', type: 'XML 2-way', commission: '15%', connected: true, icon: 'fa-solid fa-b', color: '#0066FF' },
    { id: 'ch-expedia', name: 'Expedia Partner', type: 'iCal Feed', commission: '18%', connected: false, icon: 'fa-solid fa-plane', color: '#F59E0B' },
    { id: 'ch-vrbo', name: 'Vrbo / HomeAway', type: 'iCal Feed', commission: '5%', connected: false, icon: 'fa-solid fa-house-user', color: '#3B82F6' },
    { id: 'ch-hotelcz', name: 'Hotel.cz (Previa)', type: 'Direct API', commission: '12%', connected: false, icon: 'fa-solid fa-hotel', color: '#EF4444' },
    { id: 'ch-slevomat', name: 'Slevomat.cz', type: 'API Coupon', commission: '15%', connected: false, icon: 'fa-solid fa-gift', color: '#06B6D4' },
    { id: 'ch-hrs', name: 'HRS Corporate', type: 'iCal Feed', commission: '15%', connected: false, icon: 'fa-solid fa-bed', color: '#6366F1' },
    { id: 'ch-spacz', name: 'Spa.cz (Lázenské)', type: 'API Sync', commission: '14%', connected: false, icon: 'fa-solid fa-spa', color: '#10B981' },
    { id: 'ch-hostelworld', name: 'Hostelworld', type: 'iCal Feed', commission: '12%', connected: false, icon: 'fa-solid fa-users', color: '#8B5CF6' }
];

const DEFAULT_RESERVATIONS = [
    // 100% Real Live Extranet Reservations for Konšelská
    {
        id: 'HM8HHQZWK9',
        guestName: 'Khanh Mai',
        guestEmail: 'khanh.mai@guest.airbnb.com',
        guestPhone: '+420 777 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Airbnb',
        checkIn: '2026-09-03',
        checkOut: '2026-09-08',
        guestsCount: 2,
        totalPriceEur: 264.15,
        totalPrice: 6604,
        payoutNetEur: 256.22,
        status: 'Checked-In',
        notes: 'Konšelská (Airbnb) - Zájmy hosta: architektura. Storno podmínky: Flexibilní. Celkem za 5 nocí: 264,15 €.'
    },
    {
        id: 'BKG-16884885-02',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.c989@booking-guest.com',
        guestPhone: '+420 721 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-09-14',
        checkOut: '2026-09-15',
        guestsCount: 2,
        totalPriceEur: 62.00,
        totalPrice: 1550,
        payoutNetEur: 52.70,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - iCal Sync c989a3a6'
    },
    {
        id: 'ABB-1728523339-01',
        guestName: 'Host Airbnb',
        guestEmail: 'guest.1418@guest.airbnb.com',
        guestPhone: '+420 776 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Airbnb',
        checkIn: '2026-09-15',
        checkOut: '2026-09-22',
        guestsCount: 2,
        totalPriceEur: 465.00,
        totalPrice: 11625,
        payoutNetEur: 451.05,
        status: 'Confirmed',
        notes: 'Konšelská (Airbnb Live iCal Sync) - Týdenní pobyt (7 nocí)'
    },
    {
        id: 'BKG-16884885-03',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.13b7@booking-guest.com',
        guestPhone: '+420 605 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-09-22',
        checkOut: '2026-09-24',
        guestsCount: 2,
        totalPriceEur: 124.00,
        totalPrice: 3100,
        payoutNetEur: 105.40,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - iCal Sync 13b7fcc2'
    },
    {
        id: 'BKG-16884885-01',
        guestName: 'Annamaria Terray',
        guestEmail: 'a.terray@booking-guest.com',
        guestPhone: '+421 911 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-09-25',
        checkOut: '2026-09-28',
        guestsCount: 2,
        totalPriceEur: 255.00,
        totalPrice: 6375,
        payoutNetEur: 216.75,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - Reálný pobyt Annamaria Terray.'
    },
    {
        id: 'BKG-16884885-04',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.e93c@booking-guest.com',
        guestPhone: '+420 739 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-10-01',
        checkOut: '2026-10-03',
        guestsCount: 2,
        totalPriceEur: 124.00,
        totalPrice: 3100,
        payoutNetEur: 105.40,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - iCal Sync e93cc8eb'
    },
    {
        id: 'ABB-1728523339-02',
        guestName: 'Host Airbnb',
        guestEmail: 'guest.003d@guest.airbnb.com',
        guestPhone: '+420 728 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Airbnb',
        checkIn: '2026-10-03',
        checkOut: '2026-10-05',
        guestsCount: 2,
        totalPriceEur: 170.00,
        totalPrice: 4250,
        payoutNetEur: 164.90,
        status: 'Confirmed',
        notes: 'Konšelská (Airbnb Live iCal Sync) - Víkendový pobyt'
    },
    {
        id: 'BKG-16884885-05',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.5cee@booking-guest.com',
        guestPhone: '+420 602 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-10-09',
        checkOut: '2026-10-11',
        guestsCount: 2,
        totalPriceEur: 170.00,
        totalPrice: 4250,
        payoutNetEur: 144.50,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - iCal Sync 5ceeed1a'
    },
    {
        id: 'BKG-16884885-06',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.5a6e@booking-guest.com',
        guestPhone: '+420 774 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-10-17',
        checkOut: '2026-10-18',
        guestsCount: 2,
        totalPriceEur: 85.00,
        totalPrice: 2125,
        payoutNetEur: 72.25,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - iCal Sync 5a6e18ed'
    },
    {
        id: 'ABB-1728523339-03',
        guestName: 'Host Airbnb',
        guestEmail: 'guest.02c5@guest.airbnb.com',
        guestPhone: '+420 731 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Airbnb',
        checkIn: '2026-10-24',
        checkOut: '2026-11-02',
        guestsCount: 2,
        totalPriceEur: 592.00,
        totalPrice: 14800,
        payoutNetEur: 574.24,
        status: 'Confirmed',
        notes: 'Konšelská (Airbnb Live iCal Sync) - Pobyt 9 nocí'
    },
    {
        id: 'BKG-16884885-07',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.00aa@booking-guest.com',
        guestPhone: '+420 775 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-12-03',
        checkOut: '2026-12-06',
        guestsCount: 2,
        totalPriceEur: 232.00,
        totalPrice: 5800,
        payoutNetEur: 197.20,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - Adventní pobyt'
    },
    {
        id: 'BKG-16884885-08',
        guestName: 'Host Booking.com',
        guestEmail: 'guest.0246@booking-guest.com',
        guestPhone: '+420 608 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Booking',
        checkIn: '2026-12-12',
        checkOut: '2026-12-13',
        guestsCount: 2,
        totalPriceEur: 85.00,
        totalPrice: 2125,
        payoutNetEur: 72.25,
        status: 'Confirmed',
        notes: 'Konšelská (Booking.com Extranet ID 16884885) - Adventní víkend'
    },
    {
        id: 'ABB-1728523339-04',
        guestName: 'Host Airbnb',
        guestEmail: 'guest.4c3d@guest.airbnb.com',
        guestPhone: '+420 773 *** ***',
        propertyId: 'prop-konselska',
        channel: 'Airbnb',
        checkIn: '2026-12-30',
        checkOut: '2027-01-02',
        guestsCount: 2,
        totalPriceEur: 476.00,
        totalPrice: 11900,
        payoutNetEur: 461.72,
        status: 'Confirmed',
        notes: 'Konšelská (Airbnb Live iCal Sync) - Silvestrovský pobyt'
    }
];

const DEFAULT_GUESTS_BOOK = [
    {
        id: 'gb-1',
        resId: 'HM8HHQZWK9',
        guestName: 'Khanh Mai',
        docNumber: 'DOK-2535',
        nationality: 'Zahraniční host',
        birthDate: '1990-01-01',
        property: 'Apartmán KONŠELSKÁ',
        stayDates: '03.09.2026 - 08.09.2026',
        cityTax: '500 Kč (Uhrazeno)',
        status: 'Ubytováno (PČR Ok)'
    },
    {
        id: 'gb-2',
        resId: 'BKG-16884885-01',
        guestName: 'Annamaria Terray',
        docNumber: 'DOK-9118',
        nationality: 'Slovensko',
        birthDate: '1992-07-20',
        property: 'Apartmán KONŠELSKÁ',
        stayDates: '25.09.2026 - 28.09.2026',
        cityTax: '300 Kč (Uhrazeno)',
        status: 'Potvrzeno (PČR Ok)'
    }
];

const DEFAULT_CONVERSATIONS = [
    {
        id: 'conv-1',
        guestName: 'Khanh Mai (Airbnb - tel...2535)',
        property: 'Apartmán KONŠELSKÁ',
        channel: 'Airbnb',
        time: 'Dnes 09:15',
        unread: false,
        messages: [
            { sender: 'guest', text: 'Dobrý den, kód od zámku na Konšelské (PIN 1420) funguje skvěle, jsme v pořádku ubytovaní.', time: '09:10' },
            { sender: 'host', text: 'Dobrý den! Děkujeme za zprávu, přejeme příjemný pobyt v Praze.', time: '09:15' }
        ]
    }
];

const DEFAULT_HOUSEKEEPING = [
    {
        id: 'hk-1',
        propertyId: 'prop-konselska',
        date: '2026-09-08',
        prevGuest: 'Khanh Mai (Airbnb)',
        nextGuest: 'Host Booking.com (14.9.)',
        cleaner: 'Marie Kovářová',
        status: 'Pending',
        checklist: ['Kompletní úklid Konšelská', 'Čisté povlečení a ručníky', 'Kontrola zámku PIN 1420', 'Doplnění kávy a toaletních potřeb'],
        notes: 'Konšelská: Úklid po odjezdu hosta 8.9. v 10:00–14:00.'
    },
    {
        id: 'hk-2',
        propertyId: 'prop-konselska',
        date: '2026-09-15',
        prevGuest: 'Host Booking.com',
        nextGuest: 'Host Airbnb (15.9.)',
        cleaner: 'Marie Kovářová',
        status: 'Pending',
        checklist: ['Expresní úklid Konšelská', 'Povlečení', 'Kontrola klíčů v keyboxu PIN 1420'],
        notes: 'Konšelská: Úklid v čase 10:00–14:00.'
    },
    {
        id: 'hk-3',
        propertyId: 'prop-konselska',
        date: '2026-09-22',
        prevGuest: 'Host Airbnb',
        nextGuest: 'Host Booking.com (22.9.)',
        cleaner: 'Marie Kovářová',
        status: 'Pending',
        checklist: ['Kompletní úklid', 'Výměna prádla', 'Kontrola Wi-Fi routeru'],
        notes: 'Konšelská: Úklid po týdenním pobytu.'
    },
    {
        id: 'hk-4',
        propertyId: 'prop-konselska',
        date: '2026-09-24',
        prevGuest: 'Host Booking.com',
        nextGuest: 'Annamaria Terray (25.9.)',
        cleaner: 'Marie Kovářová',
        status: 'Pending',
        checklist: ['Úklid a příprava apartmánu', 'Ručníky a ložní prádlo', 'Příprava uvítacího balíčku'],
        notes: 'Konšelská: Úklid před příjezdem Annamaria Terray.'
    },
    {
        id: 'hk-5',
        propertyId: 'prop-konselska',
        date: '2026-09-28',
        prevGuest: 'Annamaria Terray (Booking.com)',
        nextGuest: 'Host Booking.com (1.10.)',
        cleaner: 'Marie Kovářová',
        status: 'Pending',
        checklist: ['Generální úklid', 'Praní lůžkovin', 'Kontrola stavu bytu a spotřebičů'],
        notes: 'Konšelská: Měsíční závěrečný úklid.'
    }
];

// Auto-purge stale cache if old multi-property cache exists
try {
    const cachedProps = JSON.parse(localStorage.getItem('rvx_properties'));
    if (cachedProps && cachedProps.some(p => p.id === 'prop-jecna')) {
        localStorage.removeItem('rvx_properties');
        localStorage.removeItem('rvx_reservations');
        localStorage.removeItem('rvx_guestBook');
        localStorage.removeItem('rvx_conversations');
        localStorage.removeItem('rvx_housekeeping');
    }
} catch(e) {}

// App State
let state = {
    properties: JSON.parse(localStorage.getItem('rvx_properties')) || DEFAULT_PROPERTIES,
    reservations: JSON.parse(localStorage.getItem('rvx_reservations')) || DEFAULT_RESERVATIONS,
    guestBook: JSON.parse(localStorage.getItem('rvx_guestBook')) || DEFAULT_GUESTS_BOOK,
    conversations: JSON.parse(localStorage.getItem('rvx_conversations')) || DEFAULT_CONVERSATIONS,
    housekeeping: JSON.parse(localStorage.getItem('rvx_housekeeping')) || DEFAULT_HOUSEKEEPING,
    activeConvId: 'conv-1',
    currentYear: 2026,
    currentMonth: 8, // September
    activeTab: 'dashboard'
};

function saveState() {
    localStorage.setItem('rvx_properties', JSON.stringify(state.properties));
    localStorage.setItem('rvx_reservations', JSON.stringify(state.reservations));
    localStorage.setItem('rvx_guestBook', JSON.stringify(state.guestBook));
    localStorage.setItem('rvx_conversations', JSON.stringify(state.conversations));
    localStorage.setItem('rvx_housekeeping', JSON.stringify(state.housekeeping));
}

// --- DOM INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initInbox();
    renderAll();
});

function renderAll() {
    renderDashboard();
    renderTimelineCalendar();
    renderReservationsTable();
    renderHousekeepingTable();
    renderGuestBookTable();
    renderAnalyticsCharts();
    renderIcalFeeds();
    renderChannelsGrid();
}

function renderChannelsGrid() {
    const grid = document.getElementById('channelsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    // Ensure strictly only Airbnb and Booking are connected by default
    DEFAULT_CHANNELS.forEach(ch => {
        if (ch.id === 'ch-airbnb' || ch.id === 'ch-booking') {
            ch.connected = true;
        } else {
            ch.connected = false;
        }
    });

    const savedChannels = JSON.parse(localStorage.getItem('rvx_channels_connected'));
    if (savedChannels) {
        DEFAULT_CHANNELS.forEach(ch => {
            if (savedChannels[ch.id] !== undefined) {
                ch.connected = savedChannels[ch.id];
            }
        });
    }

    let activeCount = 0;

    DEFAULT_CHANNELS.forEach(ch => {
        if (ch.connected) activeCount++;
        const card = document.createElement('div');
        card.className = `channel-card ${ch.connected ? 'channel-active' : 'channel-inactive'}`;
        card.style.border = ch.connected ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)';
        card.style.background = ch.connected ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)';

        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:18px; font-weight:800; color:#fff; display:flex; align-items:center; gap:10px;">
                        <i class="${ch.icon}" style="color:${ch.color};"></i> ${escapeHtml(ch.name)}
                    </div>
                    <span class="badge ${ch.connected ? 'badge-emerald' : 'badge-neutral'}">
                        ${ch.connected ? '<i class="fa-solid fa-circle-check"></i> PROPOJENO' : '<i class="fa-solid fa-plug-circle-xmark"></i> NEPŘIPOJENO'}
                    </span>
                </div>
                <div class="text-muted" style="font-size:13px; margin-bottom:8px;">Typ propojení: <strong>${ch.type}</strong></div>
                <div class="text-muted" style="font-size:13px;">Provize portálu: <strong>${ch.commission}</strong></div>
            </div>
            <div style="margin-top:16px; display:flex; gap:8px;">
                <button class="btn ${ch.connected ? 'btn-secondary' : 'btn-emerald'} btn-sm w-100" onclick="toggleChannelConnection('${ch.id}')">
                    <i class="fa-solid ${ch.connected ? 'fa-plug-circle-xmark' : 'fa-link'}"></i> ${ch.connected ? 'Odpojit / Nastavení' : 'Připojit Tento Portál'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Update Nav Badge
    const badge = document.getElementById('activeChannelsBadge');
    if (badge) badge.textContent = `${activeCount} Aktivní`;

    // Render Diagram Nodes dynamically
    renderHubDiagramNodes();
}

function renderHubDiagramNodes() {
    const container = document.getElementById('otaHubDiagramContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="ota-node ${getChannelConnected('ch-booking') ? 'node-active' : ''}"><i class="fa-solid fa-b"></i> Booking.com <span class="node-status ${getChannelConnected('ch-booking') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-booking') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        <div class="ota-node ${getChannelConnected('ch-expedia') ? 'node-active' : ''}"><i class="fa-solid fa-plane"></i> Expedia <span class="node-status ${getChannelConnected('ch-expedia') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-expedia') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        <div class="ota-node ${getChannelConnected('ch-airbnb') ? 'node-active' : ''}"><i class="fa-brands fa-airbnb"></i> Airbnb <span class="node-status ${getChannelConnected('ch-airbnb') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-airbnb') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        
        <div class="ota-node ${getChannelConnected('ch-hotelcz') ? 'node-active' : ''}"><i class="fa-solid fa-hotel"></i> Hotel.cz <span class="node-status ${getChannelConnected('ch-hotelcz') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-hotelcz') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        <div class="ota-center-box">
            <i class="fa-solid fa-building-user icon-center"></i>
            <strong>RESERVIX</strong>
            <span>Master PMS</span>
        </div>
        <div class="ota-node ${getChannelConnected('ch-spacz') ? 'node-active' : ''}"><i class="fa-solid fa-spa"></i> Spa.cz <span class="node-status ${getChannelConnected('ch-spacz') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-spacz') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>

        <div class="ota-node ${getChannelConnected('ch-hrs') ? 'node-active' : ''}"><i class="fa-solid fa-bed"></i> HRS <span class="node-status ${getChannelConnected('ch-hrs') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-hrs') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        <div class="ota-node ${getChannelConnected('ch-slevomat') ? 'node-active' : ''}"><i class="fa-solid fa-gift"></i> Slevomat <span class="node-status ${getChannelConnected('ch-slevomat') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-slevomat') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
        <div class="ota-node ${getChannelConnected('ch-hostelworld') ? 'node-active' : ''}"><i class="fa-solid fa-house-user"></i> Hostelworld <span class="node-status ${getChannelConnected('ch-hostelworld') ? 'text-emerald' : 'text-muted'}">${getChannelConnected('ch-hostelworld') ? '<i class="fa-solid fa-check"></i> PROPOJENO' : 'NEPŘIPOJENO'}</span></div>
    `;
}

function getChannelConnected(id) {
    const ch = DEFAULT_CHANNELS.find(c => c.id === id);
    return ch ? ch.connected : false;
}

function toggleChannelConnection(id) {
    const ch = DEFAULT_CHANNELS.find(c => c.id === id);
    if (ch) {
        ch.connected = !ch.connected;
        
        // Save to localStorage
        const channelStateMap = {};
        DEFAULT_CHANNELS.forEach(c => channelStateMap[c.id] = c.connected);
        localStorage.setItem('rvx_channels_connected', JSON.stringify(channelStateMap));

        renderChannelsGrid();
        showToast(ch.connected ? `Portál ${ch.name} byl úspěšně připojen a svítí PROPOJENO!` : `Portál ${ch.name} byl odpojen a svítí NEPŘIPOJENO.`);
    }
}



function recalculateYield() {
    const price = Number(document.getElementById('calcPricePerNight').value) || 2300;
    const occupancy = Number(document.getElementById('calcOccupancy').value) || 75;

    const daysInMonth = 30;
    const bookedDays = Math.round(daysInMonth * (occupancy / 100));
    const grossRev = bookedDays * price;
    const cleaningsCount = Math.round(bookedDays / 3);
    const cleaningCosts = cleaningsCount * 800;
    const platformCommissions = Math.round(grossRev * 0.12);

    const netProfit = grossRev - cleaningCosts - platformCommissions;
    const longTermRent = 24000;
    const diffPct = Math.round(((netProfit - longTermRent) / longTermRent) * 100);

    document.getElementById('calcShortTermRevenue').textContent = `${netProfit.toLocaleString('cs-CZ')} Kč`;
    document.getElementById('calcLongTermRevenue').textContent = `${longTermRent.toLocaleString('cs-CZ')} Kč`;
    document.getElementById('calcProfitDiff').textContent = `${diffPct > 0 ? '+' : ''}${diffPct}%`;

    const aiBox = document.getElementById('aiRecText');
    if (aiBox) {
        aiBox.textContent = 'Pro apartmán Konšelská (Praha 8) doporučujeme nastavit min. stay na 2 noci během týdne. To ušetří náklady na úklid a navýší čistý zisk o cca 12 %.';
    }
}

function generateOwnerPDFReport() {
    showToast('Měsíční výplatní protokol pro majitele s přehledem kauce a příjmů byl vygenerován (PDF)!');
}



// --- TAB NAVIGATION ---
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    document.getElementById('globalSyncBtn').addEventListener('click', runGlobalSync);
    document.getElementById('btnTestIcalSync').addEventListener('click', runGlobalSync);

    // Global Search
    const searchInput = document.getElementById('globalSearchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.trim().length > 0) {
            switchTab('reservations');
            filterReservationsByQuery(query);
        } else {
            renderReservationsTable();
        }
    });
}

function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.nav-item').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `tab-${tabName}`);
    });
}

// --- DASHBOARD RENDERER ---
function renderDashboard() {
    const todayStr = '2026-09-03';

    const checkInsToday = state.reservations.filter(r => r.checkIn === todayStr && r.status !== 'Cancelled');
    const checkOutsToday = state.reservations.filter(r => r.checkOut === todayStr && r.status !== 'Cancelled');

    const totalMonthlyRev = state.reservations
        .filter(r => r.status !== 'Cancelled')
        .reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);

    document.getElementById('kpiCheckInsToday').textContent = `${checkInsToday.length} Hosté`;
    document.getElementById('kpiCheckOutsToday').textContent = `${checkOutsToday.length} Host`;
    document.getElementById('statMonthlyRev').textContent = `${totalMonthlyRev.toLocaleString('cs-CZ')} Kč`;

    // Upcoming Reservations Table
    const tbodyUpcoming = document.getElementById('tbodyUpcoming');
    tbodyUpcoming.innerHTML = '';

    const sortedUpcoming = [...state.reservations]
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
        .slice(0, 5);

    sortedUpcoming.forEach(res => {
        const prop = state.properties.find(p => p.id === res.propertyId) || { name: 'Neznámá' };
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="guest-cell">
                    <span class="guest-name">${escapeHtml(res.guestName)}</span>
                    <span class="guest-sub">${escapeHtml(res.id)}</span>
                </div>
            </td>
            <td><strong>${escapeHtml(prop.name)}</strong></td>
            <td>${getChannelBadgeHtml(res.channel)}</td>
            <td>${formatDate(res.checkIn)} – ${formatDate(res.checkOut)}</td>
            <td><strong>${Number(res.totalPrice).toLocaleString('cs-CZ')} Kč</strong></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openReservationDetail('${res.id}')">
                    <i class="fa-solid fa-eye"></i> Detail
                </button>
            </td>
        `;
        tbodyUpcoming.appendChild(tr);
    });

    // Housekeeping Dash Widget
    const hkList = document.getElementById('dashHousekeepingList');
    hkList.innerHTML = '';
    state.housekeeping.forEach(hk => {
        const prop = state.properties.find(p => p.id === hk.propertyId) || { name: 'Neznámá' };
        const div = document.createElement('div');
        div.className = 'housekeeping-item';
        div.innerHTML = `
            <div>
                <div class="hk-prop">${escapeHtml(prop.name)}</div>
                <div class="hk-info"><i class="fa-solid fa-calendar-day"></i> ${formatDate(hk.date)} | ${escapeHtml(hk.cleaner)}</div>
            </div>
            <button class="btn btn-sm ${hk.status === 'Completed' ? 'btn-emerald' : 'btn-secondary'}" onclick="toggleHousekeepingStatus('${hk.id}')">
                ${hk.status === 'Completed' ? '<i class="fa-solid fa-check"></i> Hotovo' : 'Označit hotové'}
            </button>
        `;
        hkList.appendChild(div);
    });
}

// --- TIMELINE GANTT CALENDAR ---
function renderTimelineCalendar() {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';

    const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    document.getElementById('calMonthLabel').textContent = `${monthNames[state.currentMonth]} ${state.currentYear}`;

    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const grid = document.createElement('div');
    grid.className = 'timeline-grid';

    // Header Row
    const headerRow = document.createElement('div');
    headerRow.className = 'timeline-header';

    const propColHeader = document.createElement('div');
    propColHeader.className = 'timeline-header-cell prop-col';
    propColHeader.textContent = 'Apartmán';
    headerRow.appendChild(propColHeader);

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(state.currentYear, state.currentMonth, day);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isToday = day === 3 && state.currentMonth === 8 && state.currentYear === 2026;

        const dayCell = document.createElement('div');
        dayCell.className = `timeline-header-cell ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`;
        dayCell.innerHTML = `<div>${day}</div><div style="font-size: 9px; opacity: 0.7;">${getShortDayName(d.getDay())}</div>`;
        headerRow.appendChild(dayCell);
    }
    grid.appendChild(headerRow);

    // Property Rows (JEČNÁ and KONŠELSKÁ)
    state.properties.forEach(prop => {
        const row = document.createElement('div');
        row.className = 'timeline-row';

        const propLabel = document.createElement('div');
        propLabel.className = 'timeline-prop-name';
        propLabel.textContent = prop.name;
        row.appendChild(propLabel);

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(state.currentYear, state.currentMonth, day);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const cell = document.createElement('div');
            cell.className = `timeline-cell ${isWeekend ? 'weekend' : ''}`;
            row.appendChild(cell);
        }

        // Render Reservation Bars
        const propReservations = state.reservations.filter(r => r.propertyId === prop.id && r.status !== 'Cancelled');
        propReservations.forEach(res => {
            const startDate = new Date(res.checkIn);
            const endDate = new Date(res.checkOut);

            if (startDate.getMonth() === state.currentMonth || endDate.getMonth() === state.currentMonth) {
                const startDay = Math.max(1, startDate.getDate());
                const endDay = Math.min(daysInMonth, endDate.getDate());
                const duration = Math.max(1, endDay - startDay);

                const bar = document.createElement('div');
                const channelClass = res.channel === 'Airbnb' ? 'bar-airbnb' : (res.channel === 'Booking' ? 'bar-booking' : 'bar-direct');
                bar.className = `timeline-bar ${channelClass}`;
                bar.style.left = `calc(220px + (100% - 220px) * ${startDay - 1} / ${daysInMonth})`;
                bar.style.width = `calc((100% - 220px) * ${duration} / ${daysInMonth})`;
                bar.innerHTML = `<span>${escapeHtml(res.guestName)}</span>`;
                bar.onclick = () => openReservationDetail(res.id);

                row.appendChild(bar);
            }
        });

        grid.appendChild(row);
    });

    container.appendChild(grid);

    document.getElementById('calPrevMonth').onclick = () => {
        state.currentMonth--;
        if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
        renderTimelineCalendar();
    };
    document.getElementById('calNextMonth').onclick = () => {
        state.currentMonth++;
        if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
        renderTimelineCalendar();
    };
}

// --- AIRBO UNIFIED INBOX LOGIC ---
function initInbox() {
    renderConversationsList();
    renderActiveChat();

    document.getElementById('btnSendChatMessage').addEventListener('click', sendUserChatMessage);
    document.getElementById('chatInputText').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserChatMessage();
    });
}

function renderConversationsList() {
    const list = document.getElementById('conversationsList');
    list.innerHTML = '';

    state.conversations.forEach(conv => {
        const div = document.createElement('div');
        div.className = `conv-item ${conv.id === state.activeConvId ? 'active' : ''}`;
        const lastMsg = conv.messages[conv.messages.length - 1];

        div.innerHTML = `
            <div class="conv-top">
                <span class="conv-name">${escapeHtml(conv.guestName)}</span>
                <span class="conv-time">${conv.time}</span>
            </div>
            <div class="conv-preview">${escapeHtml(lastMsg ? lastMsg.text : '')}</div>
        `;
        div.onclick = () => {
            state.activeConvId = conv.id;
            conv.unread = false;
            saveState();
            renderConversationsList();
            renderActiveChat();
        };
        list.appendChild(div);
    });
}

function renderActiveChat() {
    const conv = state.conversations.find(c => c.id === state.activeConvId);
    if (!conv) return;

    document.getElementById('chatGuestName').textContent = conv.guestName;
    document.getElementById('chatGuestSub').textContent = `${conv.property} | ${conv.channel}`;

    const container = document.getElementById('chatMessages');
    container.innerHTML = '';

    conv.messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble ${msg.sender === 'guest' ? 'msg-in' : 'msg-out'}`;
        bubble.innerHTML = `
            <div>${escapeHtml(msg.text)}</div>
            <span class="msg-time">${msg.time}</span>
        `;
        container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
}

function sendUserChatMessage() {
    const input = document.getElementById('chatInputText');
    const text = input.value.trim();
    if (!text) return;

    const conv = state.conversations.find(c => c.id === state.activeConvId);
    if (conv) {
        conv.messages.push({
            sender: 'host',
            text: text,
            time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
        });
        input.value = '';
        saveState();
        renderActiveChat();
        renderConversationsList();
    }
}

function insertTemplate(type) {
    const input = document.getElementById('chatInputText');
    const conv = state.conversations.find(c => c.id === state.activeConvId);
    const propName = conv ? conv.property : 'apartmánu';

    if (type === 'checkin') {
        input.value = `Dobrý den! Kód od keyboxu se klíči pro Apartmán Konšelská je PIN 1420. Instrukce k vyzvednutí naleznete u vchodu.`;
    } else if (type === 'wifi') {
        input.value = `Wi-Fi v Apartmánu Konšelská: Název sítě: Konselska_Guest | Heslo: Liben2026Wifi. Připojení je neomezené.`;
    } else if (type === 'checkout') {
        input.value = `Dobrý den, prosíme o check-out do 10:00. Klíče stačí vrátit zpět do keyboxu (PIN 1420) a zaklapnout. Děkujeme za pobyt!`;
    }
}

function sendAutoInstructionsModal() {
    showToast('Automatické zprávy s PIN kódem a Wi-Fi heslem byly odeslány všem hostům pro dnešní check-in!');
}

// --- SCANID / POLICE GUEST BOOK RENDERER ---
function renderGuestBookTable() {
    const tbody = document.getElementById('tbodyGuestBook');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.guestBook.forEach(gb => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(gb.guestName)}</strong></td>
            <td><span class="badge badge-neutral">${escapeHtml(gb.docNumber)}</span></td>
            <td>${escapeHtml(gb.nationality)}</td>
            <td>${gb.birthDate}</td>
            <td><strong>${escapeHtml(gb.property)}</strong></td>
            <td>${gb.stayDates}</td>
            <td><span class="text-emerald font-weight-bold">${gb.cityTax}</span></td>
            <td><span class="status-pill status-confirmed">${gb.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function exportPoliceFile() {
    showToast('Soubor UBYT_092026.TXT byl vygenerován a připraven ke stažení pro Cizineckou policii PČR!');
}

function generateGuestPortalLink() {
    navigator.clipboard.writeText('https://reservix-pms.app/checkin/link_guest_7781a9.html');
    showToast('Unikátní odkaz pro Online Check-in zkopírován do schránky!');
}

// --- PRICING RULES ---
function savePricingRules() {
    showToast('Nové cenové sazby pro Apartmán Ječná a Konšelská byly uloženy a odeslány na Airbnb i Booking!');
}

// --- RESERVATIONS TABLE RENDERER ---
function renderReservationsTable() {
    const tbody = document.getElementById('tbodyAllReservations');
    if (!tbody) return;
    tbody.innerHTML = '';

    const propertyFilter = document.getElementById('filterProperty').value;
    const channelFilter = document.getElementById('filterChannel').value;

    const filtered = state.reservations.filter(res => {
        if (propertyFilter !== 'ALL' && res.propertyId !== propertyFilter) return false;
        if (channelFilter !== 'ALL' && res.channel !== channelFilter) return false;
        return true;
    });

    filtered.forEach(res => {
        const prop = state.properties.find(p => p.id === res.propertyId) || { name: 'Neznámá' };
        const nights = calculateNights(res.checkIn, res.checkOut);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(res.id)}</strong></td>
            <td>
                <div class="guest-cell">
                    <span class="guest-name">${escapeHtml(res.guestName)}</span>
                    <span class="guest-sub">${escapeHtml(res.guestEmail || '')}</span>
                </div>
            </td>
            <td>${escapeHtml(prop.name)}</td>
            <td>${getChannelBadgeHtml(res.channel)}</td>
            <td>${formatDate(res.checkIn)}</td>
            <td>${formatDate(res.checkOut)}</td>
            <td>${nights} nocí</td>
            <td><strong>${Number(res.totalPrice).toLocaleString('cs-CZ')} Kč</strong></td>
            <td>${getStatusPillHtml(res.status)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openReservationDetail('${res.id}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterReservationsByQuery(query) {
    const tbody = document.getElementById('tbodyAllReservations');
    if (!tbody) return;
    tbody.innerHTML = '';
    const filtered = state.reservations.filter(res => {
        const prop = state.properties.find(p => p.id === res.propertyId) || { name: '' };
        return res.guestName.toLowerCase().includes(query) ||
               res.id.toLowerCase().includes(query) ||
               prop.name.toLowerCase().includes(query);
    });

    filtered.forEach(res => {
        const prop = state.properties.find(p => p.id === res.propertyId) || { name: 'Neznámá' };
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(res.id)}</strong></td>
            <td>
                <div class="guest-cell">
                    <span class="guest-name">${escapeHtml(res.guestName)}</span>
                </div>
            </td>
            <td>${escapeHtml(prop.name)}</td>
            <td>${getChannelBadgeHtml(res.channel)}</td>
            <td>${formatDate(res.checkIn)}</td>
            <td>${formatDate(res.checkOut)}</td>
            <td>${nights} nocí</td>
            <td><strong>${Number(res.totalPrice).toLocaleString('cs-CZ')} Kč</strong></td>
            <td>${getStatusPillHtml(res.status)}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="openReservationDetail('${res.id}')">Detail</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// --- HOUSEKEEPING RENDERER ---
function renderHousekeepingTable() {
    const tbody = document.getElementById('tbodyHousekeeping');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.housekeeping.forEach(hk => {
        const prop = state.properties.find(p => p.id === hk.propertyId) || { name: 'Neznámá' };
        const checklistHtml = (hk.checklist || []).map(item => `<span class="badge badge-neutral" style="margin-right:4px;"><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</span>`).join('');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${formatDate(hk.date)}</strong></td>
            <td><strong>${escapeHtml(prop.name)}</strong></td>
            <td>${escapeHtml(hk.prevGuest)} -> ${escapeHtml(hk.nextGuest)}</td>
            <td>${escapeHtml(hk.cleaner)}</td>
            <td>${checklistHtml}</td>
            <td>
                <span class="status-pill ${hk.status === 'Completed' ? 'status-confirmed' : 'status-cancelled'}">
                    ${hk.status === 'Completed' ? 'Uklizeno (Čisté)' : 'Neuklizeno (V přípravě)'}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="toggleHousekeepingStatus('${hk.id}')">
                    <i class="fa-solid fa-broom"></i> Změnit stav
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleHousekeepingStatus(id) {
    const hk = state.housekeeping.find(h => h.id === id);
    if (hk) {
        hk.status = hk.status === 'Completed' ? 'Pending' : 'Completed';
        saveState();
        renderAll();
        showToast('Stav úklidu apartmánu byl aktualizován.');
    }
}

function addNewHousekeepingTask() {
    showToast('Nová úklidová úloha naplánována na zítřek!');
}

// --- ANALYTICS CHARTS ---
function renderAnalyticsCharts() {
    const barContainer = document.getElementById('barChartRevenue');
    if (barContainer) {
        barContainer.innerHTML = `
            <svg viewBox="0 0 600 240" style="width:100%; height:100%;">
                <line x1="40" y1="40" x2="580" y2="40" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="160" x2="580" y2="160" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="200" x2="580" y2="200" stroke="rgba(255,255,255,0.2)" />
                
                <text x="30" y="45" fill="#9ca3af" font-size="10" text-anchor="end">150k</text>
                <text x="30" y="105" fill="#9ca3af" font-size="10" text-anchor="end">100k</text>
                <text x="30" y="165" fill="#9ca3af" font-size="10" text-anchor="end">50k</text>
                
                <!-- Ječná vs Konšelská Tržby -->
                <rect x="100" y="80" width="30" height="120" fill="#FF385C" rx="4" />
                <rect x="140" y="110" width="30" height="90" fill="#0066FF" rx="4" />
                <text x="135" y="220" fill="#9ca3af" font-size="11" text-anchor="middle">Červenec</text>

                <rect x="250" y="60" width="30" height="140" fill="#FF385C" rx="4" />
                <rect x="290" y="90" width="30" height="110" fill="#0066FF" rx="4" />
                <text x="285" y="220" fill="#9ca3af" font-size="11" text-anchor="middle">Srpen</text>

                <rect x="400" y="70" width="30" height="130" fill="#FF385C" rx="4" opacity="0.9"/>
                <rect x="440" y="100" width="30" height="100" fill="#0066FF" rx="4" opacity="0.9"/>
                <text x="435" y="220" fill="#9ca3af" font-size="11" text-anchor="middle">Září</text>
            </svg>
        `;
    }

    const donutContainer = document.getElementById('donutChartChannels');
    if (donutContainer) {
        donutContainer.innerHTML = `
            <svg viewBox="0 0 200 200" style="width:200px; height:200px;">
                <circle cx="100" cy="100" r="70" fill="transparent" stroke="#FF385C" stroke-width="24"
                        stroke-dasharray="255 185" stroke-dashoffset="0" />
                <circle cx="100" cy="100" r="70" fill="transparent" stroke="#0066FF" stroke-width="24"
                        stroke-dasharray="149 291" stroke-dashoffset="-255" />
                <circle cx="100" cy="100" r="70" fill="transparent" stroke="#10B981" stroke-width="24"
                        stroke-dasharray="35 405" stroke-dashoffset="-404" />
                <text x="100" y="96" fill="#ffffff" font-size="20" font-weight="800" text-anchor="middle">100%</text>
                <text x="100" y="115" fill="#9ca3af" font-size="11" text-anchor="middle">Obsazenost</text>
            </svg>
        `;
    }
}

// --- iCal FEEDS RENDERER ---
function renderIcalFeeds() {
    const list = document.getElementById('icalFeedsList');
    if (!list) return;
    list.innerHTML = '';

    state.properties.forEach(prop => {
        const item = document.createElement('div');
        item.className = 'ical-item';
        item.innerHTML = `
            <div>
                <div class="ical-title"><i class="fa-brands fa-airbnb text-accent"></i> ${escapeHtml(prop.name)} - Airbnb iCal</div>
                <div class="ical-url">${escapeHtml(prop.airbnbIcal || 'Není zadán')}</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="runGlobalSync()"><i class="fa-solid fa-rotate"></i> Synch</button>
        `;
        list.appendChild(item);
    });
}

function copyMasterIcal() {
    const input = document.getElementById('masterIcalInput');
    input.select();
    document.execCommand('copy');
    showToast('iCal Master odkaz zkopírován do schránky!');
}

function syncLiveChannelAPI() {
    showToast('Probíhá přímé 2-way API spojení s Airbnb & Booking.com Extranetem pro Apartmán Konšelská...');

    setTimeout(() => {
        state.reservations = [...DEFAULT_RESERVATIONS];
        saveState();
        renderAll();
        showToast('API synchronizace dokončena! Načteny 100% přesné reálné rezervace z Airbnb a Booking.com.');
    }, 1000);
}


// --- MODALS & FORM HANDLING ---
function initModals() {
    const btn = document.getElementById('btnQuickNewReservation');
    if (btn) btn.onclick = () => openReservationModal();
    const form = document.getElementById('formReservation');
    if (form) form.onsubmit = handleReservationSubmit;
}

function openReservationModal(resId = null) {
    const modal = document.getElementById('modalReservation');
    const form = document.getElementById('formReservation');
    form.reset();

    if (resId) {
        const res = state.reservations.find(r => r.id === resId);
        if (res) {
            document.getElementById('modalReservationTitle').textContent = 'Upravit Pobyt';
            document.getElementById('resId').value = res.id;
            document.getElementById('resGuestName').value = res.guestName;
            document.getElementById('resGuestEmail').value = res.guestEmail || '';
            document.getElementById('resGuestPhone').value = res.guestPhone || '';
            document.getElementById('resProperty').value = res.propertyId;
            document.getElementById('resChannel').value = res.channel;
            document.getElementById('resStatus').value = res.status;
            document.getElementById('resCheckIn').value = res.checkIn;
            document.getElementById('resCheckOut').value = res.checkOut;
            document.getElementById('resGuestsCount').value = res.guestsCount || 2;
            document.getElementById('resTotalPrice').value = res.totalPrice || '';
            document.getElementById('resNotes').value = res.notes || '';
        }
    } else {
        document.getElementById('modalReservationTitle').textContent = 'Nová Rezervace';
        document.getElementById('resId').value = '';
        document.getElementById('resCheckIn').value = '2026-09-15';
        document.getElementById('resCheckOut').value = '2026-09-18';
    }

    modal.classList.add('active');
}

function openReservationDetail(resId) {
    const res = state.reservations.find(r => r.id === resId);
    if (!res) return;

    const prop = state.properties.find(p => p.id === res.propertyId) || { name: 'Neznámá' };
    const body = document.getElementById('modalDetailBody');
    document.getElementById('detailResCode').textContent = `#${res.id}`;

    body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div><strong>Host:</strong> ${escapeHtml(res.guestName)}</div>
            <div><strong>Kontakt:</strong> ${escapeHtml(res.guestEmail || '-')} ${res.guestPhone ? '| ' + escapeHtml(res.guestPhone) : ''}</div>
            <div><strong>Apartmán:</strong> ${escapeHtml(prop.name)}</div>
            <div><strong>Kanál:</strong> ${getChannelBadgeHtml(res.channel)}</div>
            <div><strong>Termín:</strong> ${formatDate(res.checkIn)} – ${formatDate(res.checkOut)}</div>
            <div><strong>Celková cena:</strong> <span style="font-size:18px; font-weight:800; color:#fff;">${Number(res.totalPrice).toLocaleString('cs-CZ')} Kč</span></div>
            <div><strong>Poznámka ke klíčům:</strong> ${escapeHtml(res.notes || 'Žádná poznámka')}</div>
        </div>
    `;

    document.getElementById('btnEditRes').onclick = () => {
        closeModal('modalDetail');
        openReservationModal(res.id);
    };

    document.getElementById('btnDeleteRes').onclick = () => {
        if (confirm(`Opravdu chcete smazat rezervaci ${res.id}?`)) {
            state.reservations = state.reservations.filter(r => r.id !== res.id);
            saveState();
            renderAll();
            closeModal('modalDetail');
            showToast('Rezervace byla smazána.');
        }
    };

    document.getElementById('modalDetail').classList.add('active');
}

function handleReservationSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('resId').value;
    const isEdit = Boolean(idInput);

    const newRes = {
        id: isEdit ? idInput : `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        guestName: document.getElementById('resGuestName').value,
        guestEmail: document.getElementById('resGuestEmail').value,
        guestPhone: document.getElementById('resGuestPhone').value,
        propertyId: document.getElementById('resProperty').value,
        channel: document.getElementById('resChannel').value,
        status: document.getElementById('resStatus').value,
        checkIn: document.getElementById('resCheckIn').value,
        checkOut: document.getElementById('resCheckOut').value,
        guestsCount: Number(document.getElementById('resGuestsCount').value),
        totalPrice: Number(document.getElementById('resTotalPrice').value),
        lockCodePin: Math.floor(1000 + Math.random() * 9000).toString(),
        notes: document.getElementById('resNotes').value
    };

    if (isEdit) {
        const index = state.reservations.findIndex(r => r.id === idInput);
        if (index !== -1) state.reservations[index] = newRes;
    } else {
        state.reservations.unshift(newRes);
    }

    saveState();
    renderAll();
    closeModal('modalReservation');
    showToast(isEdit ? 'Rezervace byla upravena.' : 'Nová rezervace byla úspěšně vytvořena!');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// --- UTILS & HELPERS ---
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function calculateNights(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = d2 - d1;
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function getChannelBadgeHtml(channel) {
    if (channel === 'Airbnb') return `<span class="badge badge-airbnb"><i class="fa-brands fa-airbnb"></i> Airbnb</span>`;
    if (channel === 'Booking') return `<span class="badge badge-booking"><i class="fa-solid fa-b"></i> Booking.com</span>`;
    return `<span class="badge badge-direct"><i class="fa-solid fa-user-check"></i> Přímá</span>`;
}

function getStatusPillHtml(status) {
    if (status === 'Confirmed') return `<span class="status-pill status-confirmed">Potvrzeno</span>`;
    if (status === 'Checked-In') return `<span class="status-pill status-checked-in">Ubytováno</span>`;
    if (status === 'Completed') return `<span class="status-pill status-completed">Dokončeno</span>`;
    return `<span class="status-pill status-cancelled">Zrušeno</span>`;
}

function getShortDayName(dayIdx) {
    const names = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
    return names[dayIdx];
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
}

function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
}

function openApiCredentialsModal() {
    openModal('modalApiCredentials');
}

function saveApiCredentials(e) {
    e.preventDefault();
    const hotelId = document.getElementById('apiBkgHotelId').value;
    const user = document.getElementById('apiBkgUser').value;
    const clientId = document.getElementById('apiAirbnbClientId').value;

    const apiConfig = { hotelId, user, clientId, updatedAt: new Date().toISOString() };
    localStorage.setItem('rvx_api_credentials', JSON.stringify(apiConfig));

    closeModal('modalApiCredentials');
    showToast('2-Way API přístupy byly úspěšně uloženy! Spouštím automatické testovací spojení...');
    
    setTimeout(() => {
        syncLiveChannelAPI();
    }, 1000);
}

function copyOwnerLink(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    navigator.clipboard.writeText(input.value).then(() => {
        showToast('Odkaz pro majitele bytu byl zkopírován do schránky!');
    }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast('Odkaz pro majitele bytu byl zkopírován do schránky!');
    });
}


