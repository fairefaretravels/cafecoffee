import { useState, useEffect } from "react";

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  espresso: "#1A0A00",
  roast: "#3D1C00",
  brown: "#6B3A1F",
  caramel: "#C4762A",
  gold: "#E8A830",
  cream: "#FDF6EC",
  milk: "#FAF0DC",
  steam: "#F5E6C8",
  border: "#E8D8BC",
  muted: "#8B6E52",
  light: "#C4A882",
  green: "#1A6B3A",
  greenPale: "#E8F5EE",
  greenBorder: "#A8D8BC",
  red: "#B83020",
  redPale: "#FBEAE8",
  blue: "#1A4FA8",
  bluePale: "#E8EEFB",
  gray: "#F5F0E8",
};
const F = {
  display: "'Playfair Display', Georgia, serif",
  script: "'Dancing Script', cursive",
  ui: "'DM Sans', system-ui, sans-serif",
};

// ── Seed Data ─────────────────────────────────────────────────────────────────
const INIT_ZONES = [
  { id: 1, name: "Midtown North", status: "green", truck: "Truck 1 — Rosa", days: "Mon Wed Fri", eta: "6:15 AM" },
  { id: 2, name: "Riverside Heights", status: "green", truck: "Truck 2 — Marcus", days: "Tue Thu Sat", eta: "6:45 AM" },
  { id: 3, name: "East Village", status: "gray", truck: "Unassigned", days: "Mon Wed", eta: "—" },
  { id: 4, name: "Southside", status: "gray", truck: "Truck 3 — Jay", days: "Fri Sat", eta: "—" },
  { id: 5, name: "Downtown Core", status: "green", truck: "Park Spot", days: "Daily", eta: "8:00 AM" },
  { id: 6, name: "Office District", status: "gray", truck: "Truck 1 — Rosa", days: "Mon–Fri", eta: "11:00 AM" },
];

const INIT_MENU = [
  { id: 1, name: "The Classic", desc: "Double shot espresso, steamed whole milk", price: 6.50, category: "Hot", popular: true },
  { id: 2, name: "Golden Hour", desc: "Oat milk latte with house caramel, cinnamon", price: 7.50, category: "Hot", popular: true },
  { id: 3, name: "Cold Brew Express", desc: "18-hour slow brew, served over ice", price: 7.00, category: "Cold", popular: true },
  { id: 4, name: "The Commuter", desc: "16oz dark roast, black or with cream", price: 5.00, category: "Hot", popular: false },
  { id: 5, name: "Vanilla Sky", desc: "Iced vanilla latte, almond milk", price: 7.50, category: "Cold", popular: false },
  { id: 6, name: "Espresso Shot", desc: "Single or double, straight", price: 3.50, category: "Hot", popular: false },
  { id: 7, name: "Matcha Mist", desc: "Ceremonial matcha, oat milk, honey", price: 7.00, category: "Hot", popular: false },
  { id: 8, name: "Bag — House Blend", desc: "12oz whole bean, medium roast", price: 18.00, category: "Retail", popular: false },
  { id: 9, name: "Bag — Dark Roast", desc: "12oz whole bean, French roast", price: 18.00, category: "Retail", popular: false },
];

const INIT_ORDERS = [
  { id: 1, customer: "Aaliyah T.", zone: "Midtown North", items: [{ name: "Golden Hour", qty: 1, price: 7.50 }, { name: "Cold Brew Express", qty: 1, price: 7.00 }], status: "delivered", date: "2025-06-07", total: 14.50, recurring: true, grind: "Whole Bean" },
  { id: 2, customer: "Derek M.", zone: "Midtown North", items: [{ name: "The Classic", qty: 2, price: 6.50 }], status: "en-route", date: "2025-06-08", total: 13.00, recurring: true, grind: "—" },
  { id: 3, customer: "Sofia R.", zone: "Riverside Heights", items: [{ name: "The Commuter", qty: 1, price: 5.00 }, { name: "Bag — House Blend", qty: 1, price: 18.00 }], status: "pending", date: "2025-06-08", total: 23.00, recurring: false, grind: "Ground" },
  { id: 4, customer: "James K.", zone: "Downtown Core", items: [{ name: "Cold Brew Express", qty: 3, price: 7.00 }], status: "pending", date: "2025-06-08", total: 21.00, recurring: false, grind: "—" },
  { id: 5, customer: "Priya N.", zone: "Riverside Heights", items: [{ name: "Vanilla Sky", qty: 1, price: 7.50 }], status: "delivered", date: "2025-06-07", total: 7.50, recurring: true, grind: "—" },
];

const INIT_TRUCKS = [
  { id: 1, name: "Truck 1", callsign: "Rosa", driver: "Rosa M.", status: "en-route", zone: "Midtown North", shiftStart: "05:00", shiftEnd: "13:00", stockLoaded: true, inspected: true, inspectPhotos: 3, lat: 40.758, lng: -73.985, odometer: 42180, lastService: "2025-05-01" },
  { id: 2, name: "Truck 2", callsign: "Marcus", driver: "Marcus T.", status: "parked", zone: "Downtown Core", shiftStart: "05:00", shiftEnd: "13:00", stockLoaded: true, inspected: true, inspectPhotos: 4, lat: 40.752, lng: -73.977, odometer: 38450, lastService: "2025-04-15" },
  { id: 3, name: "Truck 3", callsign: "Jay", driver: "Jay O.", status: "loading", zone: "Base", shiftStart: "05:00", shiftEnd: "13:00", stockLoaded: false, inspected: false, inspectPhotos: 0, lat: 40.748, lng: -73.992, odometer: 29100, lastService: "2025-05-20" },
];

const INIT_EMPLOYEES = [
  { id: 1, name: "Rosa M.", role: "Driver", truck: "Truck 1", shift: "05:00–13:00", status: "on-shift", phone: "555-201-1100" },
  { id: 2, name: "Marcus T.", role: "Driver", truck: "Truck 2", shift: "05:00–13:00", status: "on-shift", phone: "555-201-1101" },
  { id: 3, name: "Jay O.", role: "Driver", truck: "Truck 3", shift: "05:00–13:00", status: "loading", phone: "555-201-1102" },
  { id: 4, name: "Carmen V.", role: "Roaster", truck: "—", shift: "04:00–12:00", status: "on-shift", phone: "555-201-1103" },
  { id: 5, name: "Theo B.", role: "Manager", truck: "—", shift: "05:00–13:00", status: "on-shift", phone: "555-201-1104" },
];

const INIT_INVENTORY = [
  { id: 1, name: "House Blend Beans", category: "Beans", stock: 240, unit: "lbs", reorder: 50, cost: 8.50 },
  { id: 2, name: "Dark Roast Beans", category: "Beans", stock: 180, unit: "lbs", reorder: 40, cost: 9.00 },
  { id: 3, name: "Whole Milk", category: "Dairy", stock: 60, unit: "gallons", reorder: 15, cost: 4.20 },
  { id: 4, name: "Oat Milk", category: "Dairy", stock: 48, unit: "cartons", reorder: 12, cost: 3.80 },
  { id: 5, name: "Almond Milk", category: "Dairy", stock: 24, unit: "cartons", reorder: 8, cost: 3.60 },
  { id: 6, name: "12oz Cups", category: "Supplies", stock: 1200, unit: "pcs", reorder: 200, cost: 0.12 },
  { id: 7, name: "16oz Cups", category: "Supplies", stock: 800, unit: "pcs", reorder: 200, cost: 0.15 },
  { id: 8, name: "House Caramel Syrup", category: "Syrups", stock: 18, unit: "bottles", reorder: 6, cost: 6.00 },
  { id: 9, name: "Vanilla Syrup", category: "Syrups", stock: 12, unit: "bottles", reorder: 6, cost: 5.50 },
];

const INIT_TESTIMONIALS = [
  { id: 1, name: "Aaliyah T.", zone: "Midtown North", text: "I got my order just in time to pull out the driveway. That saved me so much time.", cups: 22, verified: true },
  { id: 2, name: "Derek M.", zone: "Midtown North", text: "Two lattes at my door before 6:30 AM? My wife and I are hooked. This is our morning now.", cups: 18, verified: true },
  { id: 3, name: "Priya N.", zone: "Riverside Heights", text: "The Vanilla Sky is the best iced latte I have had. I cancelled my Starbucks app the same week.", cups: 31, verified: true },
  { id: 4, name: "James K.", zone: "Downtown Core", text: "Three cold brews for the team every morning. They wait for me now like I am the hero.", cups: 14, verified: true },
  { id: 5, name: "Sofia R.", zone: "Riverside Heights", text: "The house blend bag is better than what I was buying at the grocery store. Subscribe.", cups: 9, verified: true },
  { id: 6, name: "Marcus W.", zone: "Midtown North", text: "My driver Rosa knows my order by heart. She was already pulling up when I walked out. Unreal service.", cups: 27, verified: true },
  { id: 7, name: "Destiny L.", zone: "Downtown Core", text: "Free cup hit on my 20th order and I literally screamed. The Golden Hour is worth every cup.", cups: 20, verified: true },
  { id: 8, name: "Theo R.", zone: "Office District", text: "We get coffee for the whole office. The team would riot if I ever cancelled.", cups: 42, verified: true },
  { id: 9, name: "Carmen B.", zone: "Riverside Heights", text: "I am a new mom. This is a lifeline. Coffee at my door before the baby wakes up. Yes.", cups: 7, verified: true },
  { id: 10, name: "Kwame O.", zone: "Southside", text: "The Cold Brew Express hits different when it is waiting for you instead of you waiting for it.", cups: 15, verified: true },
];

const INIT_CUPS = {
  "Aaliyah T.": { cups: 22, freeEarned: 1, freeUsed: 0 },
  "Derek M.": { cups: 18, freeEarned: 0, freeUsed: 0 },
  "Priya N.": { cups: 31, freeEarned: 1, freeUsed: 1 },
  "James K.": { cups: 14, freeEarned: 0, freeUsed: 0 },
  "Sofia R.": { cups: 9, freeEarned: 0, freeUsed: 0 },
};
const CUPS_TO_FREE = 20;

const MONTHLY_REV = [
  { m: "Jan", v: 8200 }, { m: "Feb", v: 9400 }, { m: "Mar", v: 14200 },
  { m: "Apr", v: 18600 }, { m: "May", v: 22400 }, { m: "Jun", v: 19800 },
  { m: "Jul", v: 24600 }, { m: "Aug", v: 26200 }, { m: "Sep", v: 21000 },
  { m: "Oct", v: 16400 }, { m: "Nov", v: 11200 }, { m: "Dec", v: 9800 },
];

// WHITE LABEL COST MODEL
const WL = {
  truckCost: 45000,       // per truck purchase
  equipCost: 12000,       // espresso machine + grinder per truck
  licenseCost: 3500,      // permits + health cert per truck
  wrappingCost: 2800,     // branding wrap per truck
  monthlyInsurance: 380,  // per truck/month
  driverMonthly: 3200,    // per driver/month salary
  beansCostPerLb: 8.75,   // wholesale beans
  milkCostPerGal: 4.20,
  cupsCostEach: 0.13,
  avgDrinksPerShift: 80,
  avgDrinkPrice: 6.80,
  retailBagMargin: 0.55,
  platformFeeMonthly: 299, // SaaS fee for this app
};

// ── Shared UI ──────────────────────────────────────────────────────────────────
const s = {
  badge: (t) => {
    const m = {
      green: { background: C.greenPale, color: C.green, border: `1px solid ${C.greenBorder}` },
      gray: { background: C.gray, color: C.muted, border: `1px solid ${C.border}` },
      "en-route": { background: C.greenPale, color: C.green, border: `1px solid ${C.greenBorder}` },
      parked: { background: C.bluePale, color: C.blue, border: "1px solid #B5CEED" },
      loading: { background: "#FEF6DC", color: C.caramel, border: `1px solid ${C.gold}` },
      delivered: { background: C.greenPale, color: C.green, border: `1px solid ${C.greenBorder}` },
      pending: { background: "#FEF6DC", color: C.caramel, border: `1px solid ${C.gold}` },
      "on-shift": { background: C.greenPale, color: C.green, border: `1px solid ${C.greenBorder}` },
      off: { background: C.gray, color: C.muted, border: `1px solid ${C.border}` },
      Hot: { background: "#FEF0E0", color: C.brown, border: `1px solid ${C.border}` },
      Cold: { background: C.bluePale, color: C.blue, border: "1px solid #B5CEED" },
      Retail: { background: C.gray, color: C.muted, border: `1px solid ${C.border}` },
    };
    const st = m[t] || m.gray;
    return { ...st, display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, fontFamily: F.ui, letterSpacing: "0.03em" };
  },
  card: { background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12 },
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${C.border}` },
  cardTitle: { fontSize: 11, fontWeight: 600, color: C.roast, fontFamily: F.ui, textTransform: "uppercase", letterSpacing: "0.07em" },
  cardBody: { padding: "16px 18px" },
  formInput: { padding: "8px 10px", fontSize: 13, fontFamily: F.ui, border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", color: C.espresso, outline: "none", width: "100%", boxSizing: "border-box" },
  formLabel: { fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.ui, marginBottom: 4, display: "block" },
  formGroup: { display: "flex", flexDirection: "column", marginBottom: 10 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 },
  statCard: (a) => ({ background: a ? C.roast : "#fff", border: `1px solid ${a ? C.brown : C.border}`, borderRadius: 10, padding: "14px 16px" }),
  statLabel: (a) => ({ fontSize: 10, color: a ? C.steam : C.muted, marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.ui }),
  statVal: (a) => ({ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: a ? C.gold : C.espresso, lineHeight: 1 }),
  statSub: (a) => ({ fontSize: 11, color: a ? C.light : C.muted, marginTop: 4, fontFamily: F.ui }),
  btn: (v) => {
    const m = {
      primary: { background: C.espresso, color: "#fff", border: "none" },
      amber: { background: C.caramel, color: "#fff", border: "none" },
      green: { background: C.green, color: "#fff", border: "none" },
      ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
      danger: { background: C.red, color: "#fff", border: "none" },
    };
    return { ...(m[v] || m.ghost), padding: "7px 16px", fontSize: 12, fontFamily: F.ui, fontWeight: 600, borderRadius: 6, cursor: "pointer" };
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 },
};

function Bdg({ type, children }) { return <span style={s.badge(type)}>{children}</span>; }
function Btn({ onClick, variant = "ghost", style: ex, children }) { return <button onClick={onClick} style={{ ...s.btn(variant), ...ex }}>{children}</button>; }
function Card({ children, style: ex }) { return <div style={{ ...s.card, ...ex }}>{children}</div>; }
function CardHead({ title, action }) { return <div style={s.cardHead}><div style={s.cardTitle}>{title}</div>{action}</div>; }
function StatCard({ label, val, sub, accent }) {
  return (
    <div style={s.statCard(accent)}>
      <div style={s.statLabel(accent)}>{label}</div>
      <div style={s.statVal(accent)}>{val}</div>
      {sub && <div style={s.statSub(accent)}>{sub}</div>}
    </div>
  );
}
function BarChart({ data, xKey, yKey, color, height = 120, prefix = "" }) {
  const max = Math.max(...data.map(d => d[yKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} title={`${d[xKey]}: ${prefix}${d[yKey].toLocaleString()}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{ width: "100%", height: `${Math.max((d[yKey] / max) * 100, 2)}%`, background: color || C.caramel, borderRadius: "3px 3px 0 0", transition: "height .3s" }} />
          </div>
          <div style={{ fontSize: 8, color: C.light, fontFamily: F.ui, textAlign: "center" }}>{d[xKey]}</div>
        </div>
      ))}
    </div>
  );
}

// ── CUSTOMER VIEW ─────────────────────────────────────────────────────────────
function CustomerView({ zones, menu, orders, setOrders, cupsData, setCupsData }) {
  const [tab, setTab] = useState("map");
  const [cart, setCart] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [freeUnlocked, setFreeUnlocked] = useState(false);
  const [name, setName] = useState("");

  // cups loyalty helpers
  const myCups = name.trim() ? (cupsData[name.trim()] || { cups: 0, freeEarned: 0, freeUsed: 0 }) : null;
  const cupsProgress = myCups ? myCups.cups % CUPS_TO_FREE : 0;
  const hasFreeAvailable = myCups && myCups.freeEarned > myCups.freeUsed;

  function addToCart(item) { setCart(c => { const ex = c.find(i => i.id === item.id); return ex ? c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...item, qty: 1 }]; }); }
  function removeFromCart(id) { setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)); }
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartTotalAfterFree = hasFreeAvailable ? Math.max(0, cartTotal - Math.min(...cart.map(i => i.price))) : cartTotal;

  function placeOrder() {
    if (!name.trim() || cart.length === 0 || !selectedZone) return;
    const customerName = name.trim();
    const prev = cupsData[customerName] || { cups: 0, freeEarned: 0, freeUsed: 0 };
    const newCups = prev.cups + 1;
    const newFreeEarned = Math.floor(newCups / CUPS_TO_FREE);
    const usedFree = hasFreeAvailable ? prev.freeUsed + 1 : prev.freeUsed;
    setCupsData(cd => ({ ...cd, [customerName]: { cups: newCups, freeEarned: newFreeEarned, freeUsed: usedFree } }));
    if (newFreeEarned > prev.freeEarned) setFreeUnlocked(true);
    setOrders(os => [{ id: Date.now(), customer: customerName, zone: selectedZone.name, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })), status: "pending", date: new Date().toISOString().split("T")[0], total: hasFreeAvailable ? cartTotalAfterFree : cartTotal, recurring: false, grind: "—", freeRedeemed: hasFreeAvailable }, ...os]);
    setCart([]); setName(""); setOrderPlaced(true);
    setTimeout(() => { setOrderPlaced(false); setFreeUnlocked(false); }, 5000);
  }

  const greenZones = zones.filter(z => z.status === "green");
  const cats = ["Hot", "Cold", "Retail"];

  return (
    <div style={{ minHeight: "100vh", background: C.espresso, fontFamily: F.ui }}>
      {/* Hero */}
      <div style={{ padding: "40px 24px 28px", textAlign: "center" }}>
        <div style={{ fontFamily: F.script, fontSize: 42, color: C.gold, lineHeight: 1, marginBottom: 4 }}>The Coffee Express</div>
        <div style={{ fontSize: 12, color: C.steam, letterSpacing: "0.14em", textTransform: "uppercase" }}>Fresh roasted · Delivered to your door</div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 0, background: C.roast, borderBottom: `1px solid ${C.brown}` }}>
        {[["map","🗺 My Area"], ["order","☕ Order"], ["love","💛 Coffee Love"], ["track","📦 Track"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px 4px", fontSize: 11, fontFamily: F.ui, fontWeight: tab === t ? 700 : 400, border: "none", cursor: "pointer", color: tab === t ? C.gold : C.steam, background: "transparent", borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent", transition: "all .15s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px", maxWidth: 600, margin: "0 auto" }}>

        {/* MAP TAB */}
        {tab === "map" && (
          <div>
            <div style={{ fontSize: 14, color: C.cream, marginBottom: 16, fontFamily: F.ui }}>
              🟢 <strong style={{ color: C.gold }}>{greenZones.length} zones</strong> are live right now
            </div>
            {zones.map(z => (
              <div key={z.id} onClick={() => z.status === "green" && setSelectedZone(z)} style={{ background: z.status === "green" ? C.roast : "#111", border: `1px solid ${z.status === "green" ? C.brown : "#333"}`, borderLeft: `4px solid ${z.status === "green" ? C.green : "#444"}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: z.status === "green" ? "pointer" : "default", opacity: z.status === "green" ? 1 : 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: z.status === "green" ? C.cream : "#666" }}>{z.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{z.truck} · {z.days}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {z.status === "green" ? <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>ETA {z.eta}</div> : <div style={{ fontSize: 12, color: "#555" }}>Not available today</div>}
                    <Bdg type={z.status}>{z.status === "green" ? "Live" : "Offline"}</Bdg>
                  </div>
                </div>
                {z.status === "green" && selectedZone?.id === z.id && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.brown}`, fontSize: 12, color: C.gold }}>✓ Selected — go to Order tab to place your order</div>
                )}
              </div>
            ))}
            {!greenZones.length && <div style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: 40 }}>No trucks are live right now. Check back at 5:30 AM!</div>}
          </div>
        )}

        {/* ORDER TAB */}
        {tab === "order" && (
          <div>
            {orderPlaced && !freeUnlocked && (
              <div style={{ background: C.green, color: "#fff", padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
                ✓ Order placed! Your coffee is on its way ☕
                {hasFreeAvailable && <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>🎉 Free drink applied to this order!</div>}
              </div>
            )}
            {freeUnlocked && (
              <div style={{ background: C.gold, color: C.espresso, padding: "14px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 700, textAlign: "center" }}>
                🎉 You just earned a FREE CUP! It will be applied to your next order.
              </div>
            )}
            {/* Cups loyalty bar */}
            {name.trim() && myCups && (
              <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>☕ Your Cups — {myCups.cups} total</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{cupsProgress} / {CUPS_TO_FREE} to free drink</div>
                </div>
                <div style={{ height: 8, background: C.brown, borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ width: `${(cupsProgress / CUPS_TO_FREE) * 100}%`, height: "100%", background: C.gold, borderRadius: 4, transition: "width .4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 10, color: C.muted }}>
                    {Array.from({ length: CUPS_TO_FREE }).map((_, i) => (
                      <span key={i} style={{ opacity: i < cupsProgress ? 1 : 0.25, fontSize: 11 }}>☕</span>
                    ))}
                  </div>
                  {hasFreeAvailable && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, background: C.espresso, padding: "2px 10px", borderRadius: 10 }}>🎁 FREE DRINK READY</div>
                  )}
                </div>
              </div>
            )}
            {!selectedZone && (
              <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.steam }}>
                👆 Select a green zone on the Map tab first
              </div>
            )}
            {selectedZone && <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.gold, fontWeight: 600 }}>📍 Ordering for: {selectedZone.name} · ETA {selectedZone.eta}</div>}

            {cats.map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: F.ui, fontWeight: 600 }}>{cat}</div>
                {menu.filter(m => m.category === cat).map(item => {
                  const inCart = cart.find(i => i.id === item.id);
                  return (
                    <div key={item.id} style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 10, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>{item.name} {item.popular && <span style={{ fontSize: 9, background: C.gold, color: C.espresso, borderRadius: 10, padding: "1px 6px", fontWeight: 700, marginLeft: 6 }}>FAN FAV</span>}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 12 }}>
                        <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.gold }}>${item.price.toFixed(2)}</div>
                        {inCart ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => removeFromCart(item.id)} style={{ ...s.btn("ghost"), padding: "2px 8px", fontSize: 14, color: C.steam, borderColor: C.brown }}>−</button>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.cream, minWidth: 20, textAlign: "center" }}>{inCart.qty}</span>
                            <button onClick={() => addToCart(item)} style={{ ...s.btn("amber"), padding: "2px 8px", fontSize: 14 }}>+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)} style={{ ...s.btn("amber"), padding: "5px 12px" }}>Add</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {cart.length > 0 && (
              <div style={{ background: C.roast, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "16px 18px", position: "sticky", bottom: 16 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Your order</div>
                {cart.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.cream, marginBottom: 5 }}><span>{i.name} ×{i.qty}</span><span style={{ color: C.gold }}>${(i.price * i.qty).toFixed(2)}</span></div>)}
                <div style={{ borderTop: `1px solid ${C.brown}`, marginTop: 10, paddingTop: 10, marginBottom: 12 }}>
                  {hasFreeAvailable && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: C.gold }}>🎁 Free drink applied</span>
                      <span style={{ fontSize: 12, color: C.gold }}>-${(cartTotal - cartTotalAfterFree).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.cream }}>Total</span>
                    <div style={{ textAlign: "right" }}>
                      {hasFreeAvailable && <div style={{ fontSize: 12, color: C.muted, textDecoration: "line-through" }}>${cartTotal.toFixed(2)}</div>}
                      <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.gold }}>${(hasFreeAvailable ? cartTotalAfterFree : cartTotal).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <input style={{ ...s.formInput, background: "#1A0A00", borderColor: C.brown, color: C.cream, marginBottom: 10 }} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                <button onClick={placeOrder} style={{ ...s.btn("amber"), width: "100%", padding: "10px", fontSize: 14 }}>Place Order ☕</button>
              </div>
            )}
          </div>
        )}

        {/* COFFEE LOVE TAB */}
        {tab === "love" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: F.script, fontSize: 32, color: C.gold, marginBottom: 4 }}>Coffee Love</div>
              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.08em" }}>Real words from real customers — verified purchasers only</div>
            </div>
            {/* Scrolling testimonial strip */}
            <style>{`
              @keyframes scrollLeft {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .scroll-track { display: flex; animation: scrollLeft 40s linear infinite; width: max-content; }
              .scroll-track:hover { animation-play-state: paused; }
            `}</style>
            <div style={{ overflow: "hidden", marginBottom: 24, marginLeft: -20, marginRight: -20 }}>
              <div className="scroll-track">
                {[...INIT_TESTIMONIALS, ...INIT_TESTIMONIALS].map((t, i) => (
                  <div key={i} style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 12, padding: "16px 18px", marginRight: 12, width: 280, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, color: C.cream, lineHeight: 1.6, marginBottom: 12, fontStyle: "italic" }}>"{t.text}"</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{t.zone} · Verified customer</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 14 }}>☕</span>
                        <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>{t.cups}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* All testimonials listed */}
            {INIT_TESTIMONIALS.map((t, i) => (
              <div key={t.id} style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ fontSize: 14, color: C.cream, lineHeight: 1.7, marginBottom: 12, fontStyle: "italic" }}>"{t.text}"</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.zone} · ✓ Verified purchase</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>☕ {t.cups} cups earned</div>
                    <div style={{ width: 80, height: 5, background: C.brown, borderRadius: 3 }}>
                      <div style={{ width: `${Math.min((t.cups % CUPS_TO_FREE) / CUPS_TO_FREE * 100, 100)}%`, height: "100%", background: C.gold, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRACK TAB */}
        {tab === "track" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Recent orders from your area</div>
            {orders.slice(0, 6).map((o, i) => (
              <div key={o.id} style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>{o.customer}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{o.zone} · {o.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.gold }}>${o.total.toFixed(2)}</div>
                    <Bdg type={o.status}>{o.status}</Bdg>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>{o.items.map(it => `${it.name} ×${it.qty}`).join(" · ")}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── EMPLOYEE VIEW ─────────────────────────────────────────────────────────────
function EmployeeView({ trucks, setTrucks, orders }) {
  const [selectedTruck, setSelectedTruck] = useState(trucks[0]);
  const [inspectStep, setInspectStep] = useState(0);
  const [inspectDone, setInspectDone] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const truck = trucks.find(t => t.id === selectedTruck?.id) || trucks[0];
  const myOrders = orders.filter(o => o.zone === truck.zone && o.status !== "delivered");

  const inspectChecks = ["Front exterior", "Rear exterior", "Driver side", "Passenger side", "Equipment interior", "Stock loaded"];

  function markPhoto() {
    setPhotoCount(p => p + 1);
    if (photoCount + 1 >= inspectChecks.length) {
      setInspectDone(true);
      setTrucks(ts => ts.map(t => t.id === truck.id ? { ...t, inspected: true, inspectPhotos: inspectChecks.length } : t));
    } else {
      setInspectStep(s => s + 1);
    }
  }

  function markEnRoute() {
    setTrucks(ts => ts.map(t => t.id === truck.id ? { ...t, status: "en-route", stockLoaded: true } : t));
  }

  const SHIFT_SCHEDULE = [
    { time: "5:00 AM", task: "Arrive at base, inspect truck & load stock" },
    { time: "5:30 AM", task: "Depart for residential morning routes" },
    { time: "8:00 AM", task: "Park at downtown spot — walk-up service" },
    { time: "11:00 AM", task: "Office & commercial route" },
    { time: "2:00 PM", task: "Return to base, restock & end-of-day report" },
    { time: "3:00 PM", task: "Shift ends" },
  ];

  return (
    <div style={{ background: C.espresso, minHeight: "100vh", fontFamily: F.ui }}>
      <div style={{ padding: "20px 20px 12px", background: C.roast, borderBottom: `1px solid ${C.brown}` }}>
        <div style={{ fontFamily: F.script, fontSize: 28, color: C.gold }}>The Coffee Express</div>
        <div style={{ fontSize: 11, color: C.steam, marginTop: 2 }}>Employee Portal · Shift 5:00 AM – 3:00 PM</div>
      </div>

      <div style={{ padding: "16px 20px", maxWidth: 600, margin: "0 auto" }}>
        {/* Truck selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {trucks.map(t => (
            <button key={t.id} onClick={() => setSelectedTruck(t)} style={{ ...s.btn(selectedTruck?.id === t.id ? "amber" : "ghost"), fontSize: 11, borderColor: C.brown, color: selectedTruck?.id === t.id ? "#fff" : C.steam }}>
              {t.name}
            </button>
          ))}
        </div>

        {/* Truck status card */}
        <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: C.cream }}>{truck.name} — {truck.callsign}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Driver: {truck.driver} · Zone: {truck.zone}</div>
            </div>
            <Bdg type={truck.status}>{truck.status}</Bdg>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[["Shift", truck.shiftStart + "–" + truck.shiftEnd], ["Odometer", truck.odometer.toLocaleString() + " mi"], ["Last Service", truck.lastService]].map(([l, v]) => (
              <div key={l} style={{ background: "#1A0A00", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.cream, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
          {!truck.inspected && (
            <div style={{ marginTop: 12, background: "#1A0A00", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 10 }}>📸 Daily Inspection Required — {inspectChecks[inspectStep]}</div>
              {!inspectDone ? (
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {inspectChecks.map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < photoCount ? C.gold : C.brown }} />
                    ))}
                  </div>
                  <button onClick={markPhoto} style={{ ...s.btn("amber"), width: "100%", fontSize: 12 }}>📷 Photo Taken: {inspectChecks[inspectStep]}</button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.green }}>✓ Inspection complete — {inspectChecks.length} photos logged</div>
              )}
            </div>
          )}
          {truck.inspected && truck.status === "loading" && (
            <button onClick={markEnRoute} style={{ ...s.btn("green"), width: "100%", marginTop: 12, padding: "10px", fontSize: 13 }}>🚚 Mark as En Route</button>
          )}
        </div>

        {/* My orders */}
        <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Today's stops — {truck.zone}</div>
          {myOrders.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>No pending orders for this zone.</div>}
          {myOrders.map((o, i, arr) => (
            <div key={o.id} style={{ padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.brown}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.cream }}>{o.customer}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{o.items.map(it => `${it.name} ×${it.qty}`).join(", ")}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F.display, fontSize: 15, color: C.gold }}>${o.total.toFixed(2)}</div>
                <Bdg type={o.status}>{o.status}</Bdg>
              </div>
            </div>
          ))}
        </div>

        {/* Shift schedule */}
        <div style={{ background: C.roast, border: `1px solid ${C.brown}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Today's schedule</div>
          {SHIFT_SCHEDULE.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "8px 0", borderBottom: i < SHIFT_SCHEDULE.length - 1 ? `1px solid ${C.brown}` : "none" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, minWidth: 70 }}>{s.time}</div>
              <div style={{ fontSize: 12, color: C.steam }}>{s.task}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MERCHANT VIEW ─────────────────────────────────────────────────────────────
function MerchantView({ zones, setZones, trucks, setTrucks, orders, setOrders, employees, inventory, setInventory }) {
  const [tab, setTab] = useState("ops");

  const activeOrders = orders.filter(o => o.status !== "delivered");
  const totalToday = orders.filter(o => o.date === new Date().toISOString().split("T")[0]).reduce((s, o) => s + o.total, 0);

  function toggleZone(id) { setZones(zs => zs.map(z => z.id === id ? { ...z, status: z.status === "green" ? "gray" : "green" } : z)); }
  function cycleOrderStatus(id) {
    const cycle = ["pending", "en-route", "delivered"];
    setOrders(os => os.map(o => o.id === id ? { ...o, status: cycle[(cycle.indexOf(o.status) + 1) % cycle.length] } : o));
  }

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: F.ui }}>
      {/* Header */}
      <div style={{ background: C.espresso, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.script, fontSize: 26, color: C.gold }}>The Coffee Express</div>
        <div style={{ fontSize: 11, color: C.steam }}>Merchant Dashboard</div>
      </div>

      {/* Sub nav */}
      <div style={{ display: "flex", gap: 2, padding: "10px 24px", background: "#fff", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {[["ops","🚚 Operations"], ["orders","📦 Orders"], ["fleet","🚐 Fleet"], ["staff","👤 Staff"], ["inventory","📦 Inventory"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", fontSize: 11, fontFamily: F.ui, fontWeight: tab === t ? 600 : 400, border: "none", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.05em", textTransform: "uppercase", color: tab === t ? "#fff" : C.muted, background: tab === t ? C.espresso : "transparent" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* STATS always visible */}
        <div style={s.statRow}>
          <StatCard label="Active orders" val={activeOrders.length} sub={`${orders.filter(o => o.status === "pending").length} pending`} accent />
          <StatCard label="Revenue today" val={`$${totalToday.toFixed(0)}`} sub="Delivered orders" />
          <StatCard label="Trucks live" val={trucks.filter(t => t.status === "en-route").length} sub={`of ${trucks.length} on shift`} />
          <StatCard label="Zones green" val={zones.filter(z => z.status === "green").length} sub={`of ${zones.length} total`} />
        </div>

        {/* OPS TAB */}
        {tab === "ops" && (
          <div style={s.twoCol}>
            <Card>
              <CardHead title="Zone control — toggle live status" />
              <div style={s.cardBody}>
                {zones.map((z, i, arr) => (
                  <div key={z.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{z.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{z.truck} · {z.days}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Bdg type={z.status}>{z.status === "green" ? "🟢 Live" : "⚫ Offline"}</Bdg>
                      <button onClick={() => toggleZone(z.id)} style={{ ...s.btn(z.status === "green" ? "danger" : "green"), fontSize: 10, padding: "4px 10px" }}>
                        {z.status === "green" ? "Go offline" : "Go live"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHead title="Truck status" />
              <div style={s.cardBody}>
                {trucks.map((t, i, arr) => (
                  <div key={t.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🚐</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name} — {t.driver}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{t.zone} · Inspected: {t.inspected ? "✓" : "✗"} · Photos: {t.inspectPhotos}</div>
                    </div>
                    <Bdg type={t.status}>{t.status}</Bdg>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <Card>
            <div style={{ ...s.cardBody, padding: 0, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F.ui }}>
                <thead>
                  <tr>{["Date","Customer","Zone","Items","Total","Status",""].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}`, background: C.cream }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ background: i % 2 === 0 ? "#fff" : C.cream }}>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>{o.date}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{o.customer}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>{o.zone}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>{o.items.map(it => `${it.name}×${it.qty}`).join(", ")}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, fontFamily: F.display, fontWeight: 700, color: C.caramel }}>${o.total.toFixed(2)}</td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}><Bdg type={o.status}>{o.status}</Bdg></td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}><button onClick={() => cycleOrderStatus(o.id)} style={{ ...s.btn("ghost"), padding: "3px 10px", fontSize: 10 }}>→ Next</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* FLEET TAB */}
        {tab === "fleet" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {trucks.map(t => (
              <Card key={t.id}>
                <CardHead title={`${t.name} — ${t.callsign}`} />
                <div style={s.cardBody}>
                  <div style={{ marginBottom: 12 }}><Bdg type={t.status}>{t.status}</Bdg></div>
                  {[["Driver", t.driver], ["Zone", t.zone], ["Shift", t.shiftStart + "–" + t.shiftEnd], ["Odometer", t.odometer.toLocaleString() + " mi"], ["Last Service", t.lastService], ["Inspection", t.inspected ? `✓ ${t.inspectPhotos} photos` : "⚠ Not done"], ["Stock Loaded", t.stockLoaded ? "✓ Yes" : "✗ No"]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                      <span style={{ color: C.muted }}>{l}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* STAFF TAB */}
        {tab === "staff" && (
          <Card>
            <div style={{ ...s.cardBody, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>{["Name","Role","Truck","Shift","Status","Phone"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "9px 16px", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}`, background: C.cream }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => (
                    <tr key={e.id} style={{ background: i % 2 === 0 ? "#fff" : C.cream }}>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{e.name}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>{e.role}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, color: C.muted }}>{e.truck}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, color: C.muted }}>{e.shift}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}><Bdg type={e.status}>{e.status}</Bdg></td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 12 }}>{e.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* INVENTORY TAB */}
        {tab === "inventory" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {inventory.map(item => {
              const low = item.stock <= item.reorder;
              return (
                <div key={item.id} style={{ background: "#fff", border: `1px solid ${low ? C.red : C.border}`, borderRadius: 10, padding: 14, borderLeft: `3px solid ${low ? C.red : C.caramel}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontFamily: F.ui }}>{item.category} · ${item.cost}/{item.unit}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: low ? C.red : C.caramel }}>{item.stock}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{item.unit} · reorder at {item.reorder}</div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => setInventory(inv => inv.map(i => i.id === item.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i))} style={{ ...s.btn("ghost"), padding: "3px 8px" }}>−</button>
                      <button onClick={() => setInventory(inv => inv.map(i => i.id === item.id ? { ...i, stock: i.stock + 10 } : i))} style={{ ...s.btn("amber"), padding: "3px 8px", fontSize: 11 }}>+10</button>
                    </div>
                  </div>
                  {low && <div style={{ fontSize: 10, color: C.red, marginTop: 8, fontWeight: 600 }}>⚠ Reorder needed</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── BUSINESS / WHITE LABEL VIEW ───────────────────────────────────────────────
function BusinessView({ orders }) {
  const [trucks, setTrucks] = useState(3);
  const [avgDrinks, setAvgDrinks] = useState(WL.avgDrinksPerShift);
  const [avgPrice, setAvgPrice] = useState(WL.avgDrinkPrice);
  const [workDays, setWorkDays] = useState(26);

  // Per truck monthly
  const grossRevPerTruck = avgDrinks * avgPrice * workDays;
  const beansCost = avgDrinks * 0.045 * WL.beansCostPerLb * workDays; // ~0.045 lbs per drink
  const milkCost = avgDrinks * 0.025 * WL.milkCostPerGal * workDays;
  const cupsCost = avgDrinks * WL.cupsCostEach * workDays;
  const driverCost = WL.driverMonthly;
  const insuranceCost = WL.monthlyInsurance;
  const platformCost = WL.platformFeeMonthly / trucks;
  const totalCOGS = beansCost + milkCost + cupsCost;
  const totalOpex = driverCost + insuranceCost + platformCost;
  const totalExpense = totalCOGS + totalOpex;
  const profitPerTruck = grossRevPerTruck - totalExpense;
  const profitMargin = ((profitPerTruck / grossRevPerTruck) * 100).toFixed(1);

  // Startup costs
  const startupPerTruck = WL.truckCost + WL.equipCost + WL.licenseCost + WL.wrappingCost;
  const totalStartup = startupPerTruck * trucks;
  const monthlyProfit = profitPerTruck * trucks;
  const breakEvenMonths = Math.ceil(totalStartup / monthlyProfit);

  // Fleet totals
  const fleetRevenue = grossRevPerTruck * trucks;
  const fleetProfit = profitPerTruck * trucks;

  const REVENUE_ITEMS = [
    { label: "Drink revenue", val: grossRevPerTruck, color: C.gold },
  ];
  const COST_ITEMS = [
    { label: "Beans & Coffee", val: Math.round(beansCost), color: C.brown },
    { label: "Milk & Dairy", val: Math.round(milkCost), color: C.caramel },
    { label: "Cups & Supplies", val: Math.round(cupsCost), color: C.muted },
    { label: "Driver Salary", val: driverCost, color: C.roast },
    { label: "Insurance", val: Math.round(insuranceCost), color: "#888" },
    { label: "Platform Fee", val: Math.round(platformCost), color: "#aaa" },
  ];

  const allMonths = MONTHLY_REV;
  const ytd = allMonths.slice(0, 6).reduce((s, d) => s + d.v, 0);

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: F.ui }}>
      <div style={{ background: C.espresso, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.script, fontSize: 26, color: C.gold }}>The Coffee Express</div>
        <div style={{ fontSize: 11, color: C.steam }}>Business & White Label</div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>Profit & Revenue Model</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Adjust the sliders to model your fleet size and performance</div>

        {/* Controls */}
        <Card>
          <CardHead title="Fleet model inputs" />
          <div style={s.cardBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "Number of trucks", val: trucks, set: setTrucks, min: 1, max: 20, step: 1, prefix: "" },
                { label: "Drinks per shift/truck", val: avgDrinks, set: setAvgDrinks, min: 20, max: 200, step: 5, prefix: "" },
                { label: "Avg drink price ($)", val: avgPrice, set: setAvgPrice, min: 4, max: 15, step: 0.5, prefix: "$" },
                { label: "Work days / month", val: workDays, set: setWorkDays, min: 10, max: 30, step: 1, prefix: "" },
              ].map(({ label, val, set, min, max, step, prefix }) => (
                <div key={label}>
                  <label style={s.formLabel}>{label}</label>
                  <div style={{ fontFamily: F.display, fontSize: 24, fontWeight: 700, color: C.caramel, marginBottom: 6 }}>{prefix}{val}</div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: C.caramel }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.light }}><span>{min}</span><span>{max}</span></div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Per-truck P&L */}
        <div style={s.statRow}>
          <StatCard label="Revenue / truck / mo" val={`$${Math.round(grossRevPerTruck).toLocaleString()}`} sub={`${avgDrinks} drinks × ${workDays} days`} accent />
          <StatCard label="Total costs / truck / mo" val={`$${Math.round(totalExpense).toLocaleString()}`} sub="COGS + OpEx" />
          <StatCard label="Profit / truck / mo" val={`$${Math.round(profitPerTruck).toLocaleString()}`} sub={`${profitMargin}% margin`} />
          <StatCard label="Fleet profit / mo" val={`$${Math.round(fleetProfit).toLocaleString()}`} sub={`${trucks} trucks`} />
        </div>

        <div style={s.twoCol}>
          {/* Cost breakdown */}
          <Card>
            <CardHead title="Monthly cost breakdown — per truck" />
            <div style={s.cardBody}>
              {COST_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: C.text, minWidth: 130, fontFamily: F.ui }}>{item.label}</div>
                  <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4 }}>
                    <div style={{ width: `${(item.val / grossRevPerTruck) * 100}%`, height: "100%", background: item.color, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, minWidth: 70, textAlign: "right" }}>${item.val.toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${C.border}`, marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>Total costs</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.red }}>${Math.round(totalExpense).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Net profit</span>
                  <span style={{ fontFamily: F.display, fontSize: 20, fontWeight: 700, color: profitPerTruck > 0 ? C.green : C.red }}>${Math.round(profitPerTruck).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Startup & break-even */}
          <Card>
            <CardHead title="Startup costs & break-even" />
            <div style={s.cardBody}>
              {[
                ["Truck purchase (×" + trucks + ")", WL.truckCost * trucks],
                ["Equipment / truck (×" + trucks + ")", WL.equipCost * trucks],
                ["Licensing & permits (×" + trucks + ")", WL.licenseCost * trucks],
                ["Branding & wrapping (×" + trucks + ")", WL.wrappingCost * trucks],
                ["Platform setup fee", WL.platformFeeMonthly],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                  <span style={{ color: C.muted }}>{l}</span>
                  <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `2px solid ${C.border}`, fontSize: 14, fontWeight: 700 }}>
                <span>Total startup investment</span>
                <span style={{ color: C.caramel }}>${totalStartup.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: 14, background: C.cream, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Break-even point</div>
                <div style={{ fontFamily: F.display, fontSize: 40, fontWeight: 700, color: C.espresso }}>{breakEvenMonths}</div>
                <div style={{ fontSize: 13, color: C.muted }}>months at current model</div>
                <div style={{ fontSize: 12, color: C.green, marginTop: 6, fontWeight: 600 }}>+${Math.round(monthlyProfit).toLocaleString()}/mo fleet profit after break-even</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue chart */}
        <Card>
          <CardHead title="Actual revenue — 2025 YTD" />
          <div style={s.cardBody}>
            <BarChart data={allMonths} xKey="m" yKey="v" color={C.caramel} height={140} prefix="$" />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: C.muted }}>YTD (Jan–Jun)</span>
              <span style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: C.caramel }}>${ytd.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* White label box */}
        <Card style={{ borderLeft: `4px solid ${C.gold}` }}>
          <CardHead title="☕ White label licensing" />
          <div style={s.cardBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                { label: "Platform fee", val: "$299/mo", desc: "Full app — all views" },
                { label: "Setup fee", val: "$0", desc: "No onboarding cost" },
                { label: "Per-order fee", val: "0%", desc: "Keep 100% of revenue" },
              ].map(({ label, val, desc }) => (
                <div key={label} style={{ background: C.espresso, borderRadius: 10, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.gold }}>{val}</div>
                  <div style={{ fontSize: 11, color: C.steam, marginTop: 4 }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
              License <strong style={{ color: C.espresso }}>The Coffee Express</strong> platform for your own coffee truck brand. Your logo, your colors, your domain. Includes customer app, employee portal, merchant dashboard, fleet tracking, and this business analytics view. Custom branding setup included.
            </div>
            <button style={{ ...s.btn("primary"), marginTop: 16, padding: "10px 24px", fontSize: 13 }}>Request white label demo →</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const VIEWS = ["customer", "employee", "merchant", "business"];
const VIEW_LABELS = { customer: "☕ Customer", employee: "🚐 Employee", merchant: "🏪 Merchant", business: "📊 Business" };

export default function App() {
  const [view, setView] = useState("customer");
  const [zones, setZones] = useState(() => load("ce_zones", INIT_ZONES));
  const [menu] = useState(INIT_MENU);
  const [orders, setOrders] = useState(() => load("ce_orders", INIT_ORDERS));
  const [trucks, setTrucks] = useState(() => load("ce_trucks", INIT_TRUCKS));
  const [employees] = useState(INIT_EMPLOYEES);
  const [inventory, setInventory] = useState(() => load("ce_inventory", INIT_INVENTORY));

  useEffect(() => { save("ce_zones", zones); }, [zones]);
  useEffect(() => { save("ce_orders", orders); }, [orders]);
  useEffect(() => { save("ce_trucks", trucks); }, [trucks]);
  useEffect(() => { save("ce_inventory", inventory); }, [inventory]);

  return (
    <div style={{ fontFamily: F.ui }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Dancing+Script:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* View switcher */}
      <div style={{ display: "flex", background: "#111", borderBottom: "1px solid #333" }}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "9px 4px", fontSize: 10, fontFamily: F.ui, fontWeight: view === v ? 700 : 400, border: "none", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", color: view === v ? C.gold : "#666", background: view === v ? "#1A0A00" : "transparent", borderBottom: view === v ? `2px solid ${C.gold}` : "2px solid transparent" }}>
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      {view === "customer" && <CustomerView zones={zones} menu={menu} orders={orders} setOrders={setOrders} />}
      {view === "employee" && <EmployeeView trucks={trucks} setTrucks={setTrucks} orders={orders} />}
      {view === "merchant" && <MerchantView zones={zones} setZones={setZones} trucks={trucks} setTrucks={setTrucks} orders={orders} setOrders={setOrders} employees={employees} inventory={inventory} setInventory={setInventory} />}
      {view === "business" && <BusinessView orders={orders} />}
    </div>
  );
}
