import { useState, createContext, useContext, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ─── Styles ───────────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #faf6f1; --ink: #1a1208; --warm: #c8693a; --warm-light: #f0ddd0;
      --warm-mid: #e8a882; --muted: #8a7968; --border: #e4dbd0; --white: #ffffff;
      --green: #3a7c5c; --red: #b94040; --blue: #2a5fa8; --purple: #6b3fa0;
      --shadow: 0 2px 16px rgba(26,18,8,0.08); --shadow-lg: 0 8px 40px rgba(26,18,8,0.14);
    }
    body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }
    h1,h2,h3,h4 { font-family: 'Playfair Display', serif; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; border: none; outline: none; }
    input, select, textarea { font-family: 'DM Sans', sans-serif; outline: none; border: 1.5px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 14px; background: var(--white); color: var(--ink); width: 100%; transition: border-color 0.2s; }
    input:focus, select:focus, textarea:focus { border-color: var(--warm); }
    .btn-primary { background: var(--warm); color: white; padding: 11px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; transition: background 0.2s, transform 0.1s; }
    .btn-primary:hover { background: #b55a2e; } .btn-primary:active { transform: scale(0.98); }
    .btn-outline { background: transparent; color: var(--warm); border: 1.5px solid var(--warm); padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; transition: all 0.2s; }
    .btn-outline:hover { background: var(--warm-light); }
    .btn-ghost { background: transparent; color: var(--muted); padding: 8px 16px; border-radius: 8px; font-size: 14px; transition: background 0.2s, color 0.2s; }
    .btn-ghost:hover { background: var(--warm-light); color: var(--warm); }
    .btn-danger { background: var(--red); color: white; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; }
    .btn-danger:hover { opacity: 0.85; }
    .card { background: var(--white); border-radius: 16px; box-shadow: var(--shadow); overflow: hidden; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
    .badge-admin { background: #fde8d0; color: var(--warm); }
    .badge-user { background: #dceee6; color: var(--green); }
    .badge-banned { background: #fde0e0; color: var(--red); }
    .badge-pending { background: #fff3cd; color: #856404; }
    .badge-confirmed { background: #dceee6; color: var(--green); }
    .badge-rejected { background: #fde0e0; color: var(--red); }
    .badge-shipped { background: #d0e8f5; color: var(--blue); }
    .badge-delivered { background: #e8d0f5; color: var(--purple); }
    .nav { position: sticky; top: 0; z-index: 100; background: var(--white); border-bottom: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; box-shadow: 0 1px 8px rgba(26,18,8,0.05); }
    .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; cursor: pointer; }
    .nav-logo span { color: var(--warm); }
    .nav-links { display: flex; align-items: center; gap: 8px; }
    .page { min-height: calc(100vh - 64px); padding: 40px; max-width: 1200px; margin: 0 auto; }
    .grid-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
    .product-card { background: var(--white); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .product-img { width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 56px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(26,18,8,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
    .modal { background: var(--white); border-radius: 20px; padding: 36px; width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); animation: popIn 0.2s ease; max-height: 90vh; overflow-y: auto; }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .form-label { font-size: 13px; font-weight: 600; color: var(--muted); }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); padding: 12px 16px; border-bottom: 1.5px solid var(--border); }
    .table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: middle; }
    .table tr:last-child td { border-bottom: none; }
    .table tr:hover td { background: var(--cream); }
    .tabs { display: flex; gap: 4px; background: var(--warm-light); padding: 4px; border-radius: 10px; margin-bottom: 28px; width: fit-content; flex-wrap: wrap; }
    .tab { padding: 8px 20px; border-radius: 7px; font-size: 14px; font-weight: 500; background: transparent; color: var(--muted); transition: all 0.2s; }
    .tab.active { background: var(--white); color: var(--ink); font-weight: 600; box-shadow: 0 1px 6px rgba(26,18,8,0.1); }
    .alert { padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
    .alert-error { background: #fde0e0; color: var(--red); }
    .alert-success { background: #dceee6; color: var(--green); }
    .stat-card { background: var(--white); border-radius: 14px; padding: 24px; box-shadow: var(--shadow); }
    .cart-sidebar { position: fixed; right: 0; top: 64px; bottom: 0; width: 380px; background: var(--white); box-shadow: -4px 0 24px rgba(26,18,8,0.1); z-index: 90; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s ease; }
    .cart-sidebar.open { transform: translateX(0); }
    .payment-method-card { border: 2px solid var(--border); border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
    .payment-method-card:hover { border-color: var(--warm); background: var(--warm-light); }
    .payment-method-card.selected { border-color: var(--warm); background: var(--warm-light); }
    .pm-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: white; transition: all 0.2s; }
    .payment-method-card.selected .pm-check { background: var(--warm); border-color: var(--warm); }
    .payment-info-box { background: var(--cream); border: 1.5px dashed var(--warm-mid); border-radius: 10px; padding: 16px; margin: 12px 0; }
    .step-indicator { display: flex; margin-bottom: 28px; }
    .step { flex: 1; text-align: center; position: relative; }
    .step-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--border); color: var(--muted); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; transition: all 0.3s; }
    .step.active .step-dot { background: var(--warm); color: white; }
    .step.done .step-dot { background: var(--green); color: white; }
    .step-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .step.active .step-label { color: var(--warm); }
    .step::after { content: ''; position: absolute; top: 14px; left: 50%; width: 100%; height: 2px; background: var(--border); z-index: -1; }
    .step:last-child::after { display: none; }
    .step.done::after { background: var(--green); }
    .spinner { width: 36px; height: 36px; border: 3px solid var(--warm-light); border-top-color: var(--warm); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .nav { padding: 0 16px; } .page { padding: 20px 16px; } .cart-sidebar { width: 100%; } }
  `}</style>
);

// ─── Payment Methods ──────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: "bsp", label: "BSP Bank Transfer", group: "bank", icon: "🏦", details: { "Account Name": "CraftHaven Store", "Account Number": "7701-234567-001", "Branch": "Suva Main Branch" }, refLabel: "BSP Transaction Reference No." },
  { id: "anz", label: "ANZ Bank Transfer", group: "bank", icon: "🏦", details: { "Account Name": "CraftHaven Store", "Account Number": "01-0123-456789-00", "Branch": "Suva ANZ Branch" }, refLabel: "ANZ Transaction Reference No." },
  { id: "westpac", label: "Westpac Bank Transfer", group: "bank", icon: "🏦", details: { "Account Name": "CraftHaven Store", "Account Number": "0301-123456-8900", "Branch": "Suva Westpac Branch" }, refLabel: "Westpac Reference No." },
  { id: "mpaisa", label: "MPaisa (Vodafone Fiji)", group: "mobile", icon: "📱", details: { "MPaisa Number": "+679 772 XXXX", "Account Name": "CraftHaven Store" }, refLabel: "MPaisa Transaction ID" },
  { id: "mycash", label: "MyCash (Inkk Mobile)", group: "mobile", icon: "💳", details: { "MyCash Number": "+679 930 XXXX", "Account Name": "CraftHaven Store" }, refLabel: "MyCash Transaction ID" },
  { id: "cod", label: "Cash on Delivery", group: "cod", icon: "💵", details: { "Note": "Please have exact change ready.", "Delivery Area": "Suva, Nausori, Nasinu" }, refLabel: null },
];
const PM_LABELS = { bsp: "🏦 BSP", anz: "🏦 ANZ", westpac: "🏦 Westpac", mpaisa: "📱 MPaisa", mycash: "💳 MyCash", cod: "💵 COD" };
const STATUS_COLORS = { pending: "badge-pending", confirmed: "badge-confirmed", rejected: "badge-rejected", shipped: "badge-shipped", delivered: "badge-delivered" };

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
function useApp() { return useContext(AppContext); }

function AppProvider({ children }) {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch profile ──
  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
    setLoading(false);
  };

  // ── Load products & categories ──
  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*, categories(name, icon)").order("created_at");
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const fetchOrders = async () => {
    if (!currentUser) return;
    let query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (profile?.role !== "admin") query = query.eq("user_id", currentUser.id);
    const { data } = await query;
    setOrders(data || []);
  };

  const fetchUsers = async () => {
    if (profile?.role !== "admin") return;
    const { data } = await supabase.from("profiles").select("*").order("created_at");
    setUsers(data || []);
  };

  useEffect(() => { if (currentUser && profile) { fetchOrders(); fetchUsers(); } }, [currentUser, profile]);

  // ── Auth ──
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    setAuthModal(null);
    showToast("Welcome back!");
    return null;
  };

  const signup = async (name, email, password) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) return error.message;
    setAuthModal(null);
    showToast(`Account created! Welcome, ${name.split(" ")[0]}!`);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null); setOrders([]); setUsers([]); setCart([]); setPage("home");
    showToast("Logged out.");
  };

  // ── Cart ──
  const addToCart = (product) => {
    if (!currentUser) { setAuthModal("login"); return; }
    setCart(prev => { const ex = prev.find(i => i.id === product.id); if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...product, qty: 1 }]; });
    showToast(`${product.name} added to cart!`);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeFromCart(id); setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); };
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Place order ──
  const placeOrder = async (orderData) => {
    const orderId = `ORD-${Date.now()}`;
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: currentUser.id,
      user_name: profile.name,
      user_email: profile.email,
      total: cartTotal,
      payment_method: orderData.paymentMethod,
      reference_number: orderData.referenceNumber || "COD",
      address: orderData.address,
      status: "pending",
    });
    if (orderError) { showToast("Failed to place order.", "error"); return null; }

    const items = cart.map(i => ({ order_id: orderId, product_id: i.id, product_name: i.name, product_emoji: i.emoji, price: i.price, qty: i.qty }));
    await supabase.from("order_items").insert(items);

    setCart([]); setCheckoutOpen(false); setCartOpen(false);
    await fetchOrders();
    showToast("Order placed! We'll verify your payment shortly 🎉");
    return orderId;
  };

  // ── Update order status (admin) ──
  const updateOrderStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} → ${status}`);
  };

  // ── Admin: update user ──
  const updateUserRole = async (userId, role) => {
    await supabase.from("profiles").update({ role }).eq("id", userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    showToast("Role updated.");
  };
  const toggleBanUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    await supabase.from("profiles").update({ status: newStatus }).eq("id", userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`User ${newStatus === "banned" ? "banned" : "unbanned"}.`);
  };

  // ── Admin: products ──
  const saveProduct = async (form, editId) => {
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), stock: parseInt(form.stock), emoji: form.emoji, category_id: parseInt(form.category_id) };
    if (editId) await supabase.from("products").update(payload).eq("id", editId);
    else await supabase.from("products").insert(payload);
    await fetchProducts();
  };
  const deleteProduct = async (id) => { await supabase.from("products").delete().eq("id", id); await fetchProducts(); };
  const saveCategory = async (form) => { await supabase.from("categories").insert({ name: form.name, icon: form.icon }); await fetchCategories(); };
  const deleteCategory = async (id) => { await supabase.from("categories").delete().eq("id", id); await fetchCategories(); };

  return (
    <AppContext.Provider value={{
      page, setPage, currentUser, profile, products, categories, orders, users,
      cart, cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen, authModal, setAuthModal,
      loading, login, signup, logout, addToCart, removeFromCart, updateQty,
      placeOrder, updateOrderStatus, updateUserRole, toggleBanUser,
      saveProduct, deleteProduct, saveCategory, deleteCategory,
      cartTotal, cartCount, showToast, toast, fetchUsers
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: toast.type === "success" ? "#1a1208" : "#b94040", color: "white", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", animation: "popIn 0.2s ease", whiteSpace: "nowrap" }}>{toast.msg}</div>;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { setPage, currentUser, profile, logout, setAuthModal, cartCount, setCartOpen, cartOpen, page } = useApp();
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>craft<span>haven</span></div>
      <div className="nav-links">
        <button className="btn-ghost" onClick={() => setPage("home")} style={{ color: page === "home" ? "var(--warm)" : undefined, fontWeight: page === "home" ? 600 : 400 }}>Shop</button>
        {currentUser ? (
          <>
            {profile?.role === "admin" && <button className="btn-ghost" onClick={() => setPage("admin")} style={{ color: page === "admin" ? "var(--warm)" : undefined, fontWeight: page === "admin" ? 600 : 400 }}>Admin</button>}
            <button className="btn-ghost" onClick={() => setPage("catalog")} style={{ color: page === "catalog" ? "var(--warm)" : undefined, fontWeight: page === "catalog" ? 600 : 400 }}>Catalog</button>
            <button className="btn-ghost" onClick={() => setPage("orders")} style={{ color: page === "orders" ? "var(--warm)" : undefined, fontWeight: page === "orders" ? 600 : 400 }}>My Orders</button>
            <span style={{ fontSize: 13, color: "var(--muted)", padding: "0 4px" }}>Hi, {profile?.name?.split(" ")[0] || "..."}</span>
            <button className="btn-ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <><button className="btn-ghost" onClick={() => setAuthModal("login")}>Login</button><button className="btn-primary" onClick={() => setAuthModal("signup")}>Sign Up</button></>
        )}
        <button onClick={() => setCartOpen(!cartOpen)} style={{ background: "var(--warm)", color: "white", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          🛒 {cartCount > 0 && <span style={{ background: "white", color: "var(--warm)", borderRadius: 20, padding: "1px 7px", fontSize: 12 }}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal() {
  const { authModal, setAuthModal, login, signup } = useApp();
  const [mode, setMode] = useState(authModal);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setMode(authModal); setError(""); }, [authModal]);
  if (!authModal) return null;
  const handleSubmit = async () => {
    setError(""); setBusy(true);
    let err;
    if (mode === "login") {
      if (!form.email || !form.password) { setBusy(false); return setError("Please fill all fields."); }
      err = await login(form.email, form.password);
    } else {
      if (!form.name || !form.email || !form.password) { setBusy(false); return setError("Please fill all fields."); }
      if (form.password.length < 6) { setBusy(false); return setError("Password must be 6+ characters."); }
      err = await signup(form.name, form.email, form.password);
    }
    if (err) setError(err);
    setBusy(false);
  };
  return (
    <div className="modal-overlay" onClick={() => setAuthModal(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24 }}>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <button className="btn-ghost" onClick={() => setAuthModal(null)} style={{ fontSize: 18 }}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {mode === "signup" && <div className="form-group"><label className="form-label">Full Name</label><input placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>}
        <div className="form-group"><label className="form-label">Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
        <button className="btn-primary" style={{ width: "100%", marginTop: 8, opacity: busy ? 0.7 : 1 }} onClick={handleSubmit} disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}</button>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "var(--warm)", cursor: "pointer", fontWeight: 600 }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>{mode === "login" ? "Sign up" : "Log in"}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, cart, cartTotal, placeOrder } = useApp();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [busy, setBusy] = useState(false);
  if (!checkoutOpen) return null;
  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
  const goToPayment = () => { if (!address.trim()) return setError("Please enter your delivery address."); setError(""); setStep(2); };
  const handlePlaceOrder = async () => {
    if (!selectedMethod) return setError("Please select a payment method.");
    if (method.refLabel && !reference.trim()) return setError("Please enter your transaction reference number.");
    setError(""); setBusy(true);
    const id = await placeOrder({ paymentMethod: selectedMethod, referenceNumber: reference || "COD", address });
    setBusy(false);
    if (id) { setOrderId(id); setStep(3); }
  };
  const handleClose = () => { setCheckoutOpen(false); setStep(1); setAddress(""); setSelectedMethod(null); setReference(""); setError(""); setOrderId(null); };
  const MethodCard = ({ m }) => (
    <div className={`payment-method-card ${selectedMethod === m.id ? "selected" : ""}`} onClick={() => { setSelectedMethod(m.id); setReference(""); }}>
      <div className="pm-check">{selectedMethod === m.id && <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✓</span>}</div>
      <span style={{ fontSize: 22 }}>{m.icon}</span>
      <div><p style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</p>{m.id === "mpaisa" && <p style={{ fontSize: 11, color: "var(--muted)" }}>Vodafone Fiji</p>}{m.id === "mycash" && <p style={{ fontSize: 11, color: "var(--muted)" }}>Inkk Mobile</p>}{m.id === "cod" && <p style={{ fontSize: 11, color: "var(--muted)" }}>Pay when order arrives</p>}</div>
    </div>
  );
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="step-indicator">
          {["Summary", "Payment", "Done"].map((label, i) => (
            <div key={label} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
              <div className="step-dot">{step > i + 1 ? "✓" : i + 1}</div>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>
        {step === 1 && (
          <>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Order Summary</h2>
            <div style={{ background: "var(--cream)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              {cart.map(item => (<div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}><span>{item.emoji} {item.name} <span style={{ color: "var(--muted)" }}>× {item.qty}</span></span><span style={{ fontWeight: 600 }}>FJ${(item.price * item.qty).toFixed(2)}</span></div>))}
              <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}><span>Total</span><span style={{ color: "var(--warm)" }}>FJ${cartTotal.toFixed(2)}</span></div>
            </div>
            <div className="form-group"><label className="form-label">Delivery Address</label><textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="e.g. 12 Ratu Sukuna Rd, Suva" style={{ resize: "none" }} /></div>
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: "flex", gap: 10 }}><button className="btn-primary" style={{ flex: 1 }} onClick={goToPayment}>Choose Payment →</button><button className="btn-outline" onClick={handleClose}>Cancel</button></div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>Select Payment</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Amount due: <strong style={{ color: "var(--warm)", fontSize: 16 }}>FJ${cartTotal.toFixed(2)}</strong></p>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>🏦 Bank Transfer</p>
            {PAYMENT_METHODS.filter(m => m.group === "bank").map(m => <MethodCard key={m.id} m={m} />)}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>📱 Mobile Payments</p>
            {PAYMENT_METHODS.filter(m => m.group === "mobile").map(m => <MethodCard key={m.id} m={m} />)}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>💵 Other</p>
            {PAYMENT_METHODS.filter(m => m.group === "cod").map(m => <MethodCard key={m.id} m={m} />)}
            {method && (
              <div className="payment-info-box">
                <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{method.id === "cod" ? "Cash on Delivery" : `Send FJ$${cartTotal.toFixed(2)} to:`}</p>
                {Object.entries(method.details).map(([k, v]) => (<div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}><span style={{ color: "var(--muted)", fontWeight: 600 }}>{k}</span><span style={{ fontWeight: 700, fontFamily: "monospace" }}>{v}</span></div>))}
              </div>
            )}
            {method?.refLabel && (
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">{method.refLabel}</label>
                <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. TXN-123456789" />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Enter the reference number from your receipt or SMS.</span>
              </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn-primary" style={{ flex: 1, opacity: busy ? 0.7 : 1 }} onClick={handlePlaceOrder} disabled={busy}>{busy ? "Placing order..." : "Place Order ✓"}</button>
              <button className="btn-outline" onClick={() => { setStep(1); setError(""); }}>Back</button>
            </div>
          </>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 26, marginBottom: 10 }}>Order Placed!</h2>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>Order <strong>{orderId}</strong> received. We'll verify your payment and update your order status.</p>
            <button className="btn-primary" style={{ width: "100%" }} onClick={handleClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
function CartSidebar() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, setCheckoutOpen } = useApp();
  return (
    <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
      <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 20 }}>Your Cart</h3>
        <button className="btn-ghost" onClick={() => setCartOpen(false)} style={{ fontSize: 18 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {cart.length === 0 ? (<div style={{ textAlign: "center", color: "var(--muted)", paddingTop: 60 }}><div style={{ fontSize: 48 }}>🛒</div><p style={{ marginTop: 12 }}>Your cart is empty</p></div>) :
          cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
              <div style={{ fontSize: 28, width: 48, height: 48, background: "var(--warm-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                <p style={{ color: "var(--warm)", fontWeight: 700, fontSize: 14 }}>FJ${item.price}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 24, height: 24, borderRadius: 6, background: "var(--border)", border: "none", cursor: "pointer", fontWeight: 700 }}>-</button>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 24, height: 24, borderRadius: 6, background: "var(--border)", border: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "auto", color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: "20px 24px", borderTop: "1.5px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 600 }}>Total</span><span style={{ fontWeight: 700, fontSize: 18, color: "var(--warm)" }}>FJ${cartTotal.toFixed(2)}</span></div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["🏦 BSP/ANZ/Westpac", "📱 MPaisa", "💳 MyCash", "💵 COD"].map(p => (<span key={p} style={{ fontSize: 11, background: "var(--warm-light)", color: "var(--warm)", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{p}</span>))}
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Proceed to Checkout →</button>
        </div>
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage() {
  const { products, categories, addToCart, setAuthModal, currentUser } = useApp();
  const [selectedCat, setSelectedCat] = useState(0);
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => (selectedCat === 0 || p.category_id === selectedCat) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page">
      <div style={{ background: "linear-gradient(135deg, var(--warm-light) 0%, #fde8d4 100%)", borderRadius: 24, padding: "52px 48px", marginBottom: 48, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 520 }}>
          <p style={{ color: "var(--warm)", fontWeight: 600, letterSpacing: 1, fontSize: 13, textTransform: "uppercase", marginBottom: 12 }}>Handmade in Fiji 🇫🇯</p>
          <h1 style={{ fontSize: 46, lineHeight: 1.15, marginBottom: 16 }}>Unique goods,<br /><span style={{ color: "var(--warm)" }}>crafted for you</span></h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>Discover one-of-a-kind clothing, crafts & accessories. Pay your way.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {["🏦 BSP · ANZ · Westpac", "📱 MPaisa", "💳 MyCash", "💵 Cash on Delivery"].map(p => (<span key={p} style={{ background: "white", color: "var(--warm)", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{p}</span>))}
          </div>
          <button className="btn-primary" style={{ fontSize: 16, padding: "13px 32px" }} onClick={() => !currentUser && setAuthModal("signup")}>{currentUser ? "Browse Collection ↓" : "Shop Now →"}</button>
        </div>
        <div style={{ fontSize: 110, opacity: 0.15, position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)" }}>🛍️</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
        <input style={{ maxWidth: 260 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="badge" onClick={() => setSelectedCat(0)} style={{ padding: "7px 16px", cursor: "pointer", background: selectedCat === 0 ? "var(--warm)" : "var(--warm-light)", color: selectedCat === 0 ? "white" : "var(--warm)" }}>All</button>
          {categories.map(c => (<button key={c.id} className="badge" onClick={() => setSelectedCat(c.id)} style={{ padding: "7px 16px", cursor: "pointer", background: selectedCat === c.id ? "var(--warm)" : "var(--warm-light)", color: selectedCat === c.id ? "white" : "var(--warm)" }}>{c.icon} {c.name}</button>))}
        </div>
      </div>
      <div className="grid-products">
        {filtered.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-img" style={{ background: "var(--warm-light)" }}>{product.emoji}</div>
            <div style={{ padding: "16px 20px 20px" }}>
              <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{product.categories?.name}</p>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{product.name}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>{product.description?.slice(0, 60)}...</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--warm)" }}>FJ${product.price}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{product.stock} left</span>
              </div>
              <button className="btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}><div style={{ fontSize: 48 }}>🔍</div><p style={{ marginTop: 12 }}>No products found</p></div>}
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function OrdersPage() {
  const { orders, currentUser, profile } = useApp();
  if (!currentUser) return <div className="page"><div className="alert alert-error">Please log in to view orders.</div></div>;
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 32, marginBottom: 6 }}>My Orders</h1><p style={{ color: "var(--muted)" }}>{orders.length} order{orders.length !== 1 ? "s" : ""}</p></div>
      {orders.length === 0 ? (<div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}><div style={{ fontSize: 56 }}>📦</div><p style={{ marginTop: 12, fontSize: 16 }}>No orders yet</p></div>) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div><p style={{ fontWeight: 700, fontSize: 16 }}>{order.id}</p><p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{new Date(order.created_at).toLocaleDateString()} · {order.address}</p></div>
                <div style={{ textAlign: "right" }}><span className={`badge ${STATUS_COLORS[order.status] || "badge-pending"}`}>{order.status}</span><p style={{ fontWeight: 700, fontSize: 18, color: "var(--warm)", marginTop: 4 }}>FJ${parseFloat(order.total).toFixed(2)}</p></div>
              </div>
              <div style={{ background: "var(--cream)", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                {order.order_items?.map(item => (<div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}><span>{item.product_emoji} {item.product_name} × {item.qty}</span><span style={{ fontWeight: 600 }}>FJ${(item.price * item.qty).toFixed(2)}</span></div>))}
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: "var(--muted)", fontWeight: 600 }}>Payment: </span><strong>{PM_LABELS[order.payment_method] || order.payment_method}</strong>
                {order.reference_number && order.reference_number !== "COD" && (<span style={{ marginLeft: 12, fontFamily: "monospace", background: "var(--warm-light)", color: "var(--warm)", padding: "3px 10px", borderRadius: 6, fontSize: 12 }}>Ref: {order.reference_number}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
function AdminPage() {
  const { profile, orders, users, products, updateOrderStatus, updateUserRole, toggleBanUser, showToast, fetchUsers } = useApp();
  const [tab, setTab] = useState("orders");
  useEffect(() => { fetchUsers(); }, []);
  if (profile?.role !== "admin") return <div className="page"><div className="alert alert-error">Access denied. Admins only.</div></div>;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const revenue = orders.filter(o => o.status !== "rejected").reduce((s, o) => s + parseFloat(o.total), 0);
  const ORDER_STATUSES = ["pending", "confirmed", "rejected", "shipped", "delivered"];
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 32, marginBottom: 6 }}>Admin Dashboard</h1><p style={{ color: "var(--muted)" }}>Manage orders, verify payments, and control user access.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[{ label: "Total Orders", value: orders.length, icon: "📦" }, { label: "Pending Payments", value: pendingOrders, icon: "⏳" }, { label: "Total Revenue", value: `FJ$${revenue.toFixed(0)}`, icon: "💰" }, { label: "Users", value: users.length, icon: "👥" }, { label: "Products", value: products.length, icon: "🏷️" }].map(s => (
          <div key={s.label} className="stat-card" style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ fontSize: 30 }}>{s.icon}</span><div><p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{s.value}</p><p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{s.label}</p></div></div>
        ))}
      </div>
      <div className="tabs">
        <button className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>Orders {pendingOrders > 0 && <span style={{ background: "var(--warm)", color: "white", borderRadius: 20, padding: "1px 7px", fontSize: 11, marginLeft: 6 }}>{pendingOrders}</span>}</button>
        <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Users</button>
      </div>

      {tab === "orders" && (
        <div className="card">
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)" }}><h3 style={{ fontSize: 18 }}>Payment Verification & Orders</h3></div>
          {orders.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>No orders yet.</div> : orders.map(order => (
            <div key={order.id} style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                <div><span style={{ fontWeight: 700 }}>{order.id}</span><span style={{ marginLeft: 10, fontSize: 13, color: "var(--muted)" }}>{new Date(order.created_at).toLocaleDateString()}</span><p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}><strong>{order.user_name}</strong> · {order.user_email} · {order.address}</p></div>
                <div style={{ textAlign: "right" }}><p style={{ fontWeight: 700, fontSize: 18, color: "var(--warm)" }}>FJ${parseFloat(order.total).toFixed(2)}</p><span className={`badge ${STATUS_COLORS[order.status] || ""}`}>{order.status}</span></div>
              </div>
              <div style={{ background: "var(--cream)", borderRadius: 8, padding: "8px 14px", marginBottom: 10, fontSize: 13 }}>
                {order.order_items?.map(item => <span key={item.id} style={{ marginRight: 16 }}>{item.product_emoji} {item.product_name} ×{item.qty}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12, padding: "10px 14px", background: order.status === "pending" ? "#fffbea" : "var(--cream)", borderRadius: 8, border: order.status === "pending" ? "1.5px solid #fcd34d" : "1.5px solid var(--border)" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{PM_LABELS[order.payment_method]}</span>
                {order.reference_number && order.reference_number !== "COD" ? (<span style={{ fontFamily: "monospace", background: "white", border: "1.5px solid var(--warm-mid)", color: "var(--warm)", padding: "4px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>📋 Ref: {order.reference_number}</span>) : <span className="badge" style={{ background: "#f0f0f0", color: "#555" }}>Cash on Delivery</span>}
                {order.status === "pending" && order.payment_method !== "cod" && <span style={{ fontSize: 12, color: "#856404", fontWeight: 600 }}>⚠️ Awaiting verification</span>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ORDER_STATUSES.map(s => (<button key={s} onClick={() => updateOrderStatus(order.id, s)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", background: order.status === s ? "var(--warm)" : "var(--warm-light)", color: order.status === s ? "white" : "var(--warm)", border: "none" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="card">
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)" }}><h3 style={{ fontSize: 18 }}>User Management</h3></div>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{user.email}</td>
                  <td>
                    <select value={user.role} onChange={e => updateUserRole(user.id, e.target.value)} disabled={user.id === profile?.id} style={{ width: "auto", padding: "5px 10px", fontSize: 12 }}>
                      <option value="user">User</option><option value="admin">Admin</option>
                    </select>
                  </td>
                  <td><span className={`badge badge-${user.status === "banned" ? "banned" : user.role === "admin" ? "admin" : "user"}`}>{user.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    {user.id !== profile?.id ? (
                      <button style={{ background: user.status === "banned" ? "var(--green)" : "var(--warm)", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }} onClick={() => toggleBanUser(user.id, user.status)}>
                        {user.status === "banned" ? "Unban" : "Ban"}
                      </button>
                    ) : <span style={{ fontSize: 12, color: "var(--muted)" }}>You</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Catalog Page ─────────────────────────────────────────────────────────────
function CatalogPage() {
  const { products, categories, saveProduct, deleteProduct, saveCategory, deleteCategory, currentUser, showToast } = useApp();
  const [tab, setTab] = useState("products");
  const [prodModal, setProdModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category_id: "", stock: "", emoji: "📦", description: "" });
  const [catForm, setCatForm] = useState({ name: "", icon: "📦" });
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const EMOJIS = ["📦","👗","👕","👜","🧶","🎨","🕯️","🏺","🛍️","🧢","💍","🎀","🌸","🍃","✨","🎁"];
  if (!currentUser) return <div className="page"><div className="alert alert-error">Please log in to manage the catalog.</div></div>;
  const openAddProd = () => { setEditProd(null); setForm({ name: "", price: "", category_id: categories[0]?.id || "", stock: "", emoji: "📦", description: "" }); setFormError(""); setProdModal(true); };
  const openEditProd = (p) => { setEditProd(p); setForm({ name: p.name, price: p.price, category_id: p.category_id, stock: p.stock, emoji: p.emoji, description: p.description }); setFormError(""); setProdModal(true); };
  const handleSaveProd = async () => {
    setFormError("");
    if (!form.name || !form.price || !form.category_id || !form.stock) return setFormError("All fields required.");
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) return setFormError("Enter a valid price.");
    setBusy(true);
    await saveProduct(form, editProd?.id);
    setBusy(false); setProdModal(false);
    showToast(editProd ? "Product updated." : "Product added.");
  };
  const handleDeleteProd = async (id) => { await deleteProduct(id); showToast("Product removed."); };
  const handleAddCat = async () => { if (!catForm.name) return; await saveCategory(catForm); setCatForm({ name: "", icon: "📦" }); setCatModal(false); showToast("Category added."); };
  const handleDeleteCat = async (id) => { await deleteCategory(id); showToast("Category removed."); };
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 32, marginBottom: 6 }}>Catalog Management</h1><p style={{ color: "var(--muted)" }}>Add, edit, and price your products and categories.</p></div>
      <div className="tabs">
        <button className={`tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>Products ({products.length})</button>
        <button className={`tab ${tab === "categories" ? "active" : ""}`} onClick={() => setTab("categories")}>Categories ({categories.length})</button>
      </div>
      {tab === "products" && (
        <div className="card">
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ fontSize: 18 }}>All Products</h3><button className="btn-primary" onClick={openAddProd}>+ Add Product</button></div>
          <table className="table">
            <thead><tr><th>Product</th><th>Category</th><th>Price (FJD)</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 24, width: 40, height: 40, background: "var(--warm-light)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.emoji}</span><div><p style={{ fontWeight: 600 }}>{p.name}</p><p style={{ fontSize: 12, color: "var(--muted)" }}>{p.description?.slice(0, 40)}...</p></div></div></td>
                  <td><span className="badge badge-user">{p.categories?.name || "—"}</span></td>
                  <td style={{ fontWeight: 700, color: "var(--warm)", fontSize: 16 }}>FJ${p.price}</td>
                  <td><span style={{ background: p.stock < 5 ? "#fde0e0" : "var(--warm-light)", color: p.stock < 5 ? "var(--red)" : "var(--warm)", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.stock} units</span></td>
                  <td style={{ display: "flex", gap: 8 }}><button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => openEditProd(p)}>Edit</button><button className="btn-danger" onClick={() => handleDeleteProd(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "categories" && (
        <div className="card">
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ fontSize: 18 }}>Categories</h3><button className="btn-primary" onClick={() => setCatModal(true)}>+ Add Category</button></div>
          <table className="table">
            <thead><tr><th>Icon</th><th>Name</th><th>Products</th><th>Actions</th></tr></thead>
            <tbody>{categories.map(c => (<tr key={c.id}><td style={{ fontSize: 28 }}>{c.icon}</td><td style={{ fontWeight: 600 }}>{c.name}</td><td style={{ color: "var(--muted)" }}>{products.filter(p => p.category_id === c.id).length} products</td><td><button className="btn-danger" onClick={() => handleDeleteCat(c.id)}>Delete</button></td></tr>))}</tbody>
          </table>
        </div>
      )}
      {prodModal && (
        <div className="modal-overlay" onClick={() => setProdModal(false)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>{editProd ? "Edit Product" : "Add Product"}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}><label className="form-label">Product Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Price (FJD)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Stock</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Category</label><select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Emoji</label><select value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })}>{EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}><label className="form-label">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ resize: "vertical" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}><button className="btn-primary" style={{ flex: 1, opacity: busy ? 0.7 : 1 }} onClick={handleSaveProd} disabled={busy}>{busy ? "Saving..." : editProd ? "Save Changes" : "Add Product"}</button><button className="btn-outline" onClick={() => setProdModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
      {catModal && (
        <div className="modal-overlay" onClick={() => setCatModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Add Category</h2>
            <div className="form-group"><label className="form-label">Name</label><input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Icon</label><select value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })}>{EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}><button className="btn-primary" style={{ flex: 1 }} onClick={handleAddCat}>Add Category</button><button className="btn-outline" onClick={() => setCatModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>craft<span style={{ color: "var(--warm)" }}>haven</span></div>
      <div className="spinner" />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function PageRouter() {
  const { page, loading } = useApp();
  if (loading) return <LoadingScreen />;
  if (page === "admin") return <AdminPage />;
  if (page === "catalog") return <CatalogPage />;
  if (page === "orders") return <OrdersPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <AppProvider>
      <FontStyle />
      <Navbar />
      <PageRouter />
      <CartSidebar />
      <CheckoutModal />
      <AuthModal />
      <Toast />
    </AppProvider>
  );
}
