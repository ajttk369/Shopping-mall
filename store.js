(() => {
  "use strict";
  const categories = ["OUTER", "TOP", "PANTS", "SHOES", "BAG", "ACC"];
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function notify(message) {
    let notice = document.querySelector("#storageNotice");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "storageNotice";
      notice.className = "storage-notice";
      notice.setAttribute("role", "alert");
      document.body.append(notice);
    }
    notice.textContent = message;
  }
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? clone(fallback) : JSON.parse(value);
    } catch {
      notify("저장된 정보를 읽지 못했습니다. 브라우저 저장 공간 설정을 확인해주세요.");
      return clone(fallback);
    }
  }
  function transaction(values) {
    const previous = {};
    try {
      for (const key of Object.keys(values)) previous[key] = localStorage.getItem(key);
      for (const [key, value] of Object.entries(values)) {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch {
      try {
        for (const [key, value] of Object.entries(previous)) {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        }
      } catch { /* Storage may remain unavailable; do not report success. */ }
      notify("변경 내용을 저장하지 못했습니다. 저장 공간을 확인한 뒤 다시 시도해주세요.");
      return false;
    }
  }
  const save = (key, value) => transaction({ [key]: value });
  function imageUrl(value) {
    const text = String(value || "").trim();
    if (text.startsWith("images/") && !/[\\\x00-\x1f]/.test(text) && !text.split("/").includes("..")) return text;
    try {
      const url = new URL(text);
      if (url.protocol === "https:" && !url.username && !url.password) return url.href;
    } catch { /* Relative paths outside images are not product assets. */ }
    return "";
  }
  function normalizeProduct(value) {
    if (!value || typeof value !== "object" || !Number.isSafeInteger(value.id) || value.id <= 0) return null;
    if (typeof value.name !== "string" || !value.name.trim() || typeof value.brand !== "string") return null;
    if (!categories.includes(value.category) || !Number.isSafeInteger(value.price) || value.price < 0 || value.price > 100000000) return null;
    if (!Number.isInteger(value.discount) || value.discount < 0 || value.discount > 80 || !imageUrl(value.image)) return null;
    const sizes = [...new Set((Array.isArray(value.sizes) ? value.sizes : []).filter((size) => typeof size === "string" && size.trim() && size.length <= 24 && !["__proto__", "constructor", "prototype"].includes(size)))].slice(0, 20);
    if (!sizes.length) return null;
    const stock = Object.fromEntries(sizes.map((size) => [size, Number.isInteger(value.stock?.[size]) ? Math.max(0, Math.min(100000, value.stock[size])) : 0]));
    const details = value.details && typeof value.details === "object" ? value.details : {};
    const measurements = Object.fromEntries(sizes.map((size) => {
      const row = details.measurements?.[size];
      const entries = row && typeof row === "object" ? Object.entries(row).filter(([label, number]) =>
        typeof label === "string" && label.length <= 20 && !["__proto__", "constructor", "prototype"].includes(label) && Number.isFinite(number) && number > 0 && number <= 300).slice(0, 6) : [];
      return [size, Object.fromEntries(entries)];
    }).filter(([, row]) => Object.keys(row).length));
    const cleanText = (text, limit) => typeof text === "string" ? text.trim().slice(0, limit) : "";
    return { ...value, name: value.name.slice(0, 160), brand: value.brand.slice(0, 80), image: imageUrl(value.image), hoverImage: imageUrl(value.hoverImage), sizes, stock,
      details: { description: cleanText(details.description, 2000), material: cleanText(details.material, 300), fit: cleanText(details.fit, 300), care: cleanText(details.care, 1000), measurements },
      gallery: [...new Set((Array.isArray(value.gallery) ? value.gallery : []).map(imageUrl).filter(Boolean))].slice(0, 8),
      rating: Number.isFinite(value.rating) ? Math.max(0, Math.min(5, value.rating)) : 0,
      createdAt: Number(value.createdAt) || 0, isBest: Boolean(value.isBest), isNew: Boolean(value.isNew),
      colors: (Array.isArray(value.colors) ? value.colors : []).filter((color) => /^#[0-9a-f]{6}$/i.test(color)),
      collections: (Array.isArray(value.collections) ? value.collections : []).filter((item) => typeof item === "string").slice(0, 10) };
  }
  function products() {
    const stored = read("blackFitProducts", null);
    // A deliberately empty catalog is valid and must not trigger reseeding.
    const source = stored === null ? Shop.seed : Array.isArray(stored) ? stored : [];
    const seen = new Set();
    return source.map((item) => item && normalizeProduct({ ...item, details: item.details ?? Shop.seed.find((seed) => seed.id === item.id)?.details })).filter((item) => item && !seen.has(item.id) && seen.add(item.id));
  }
  function cart(catalog = products()) {
    const stored = read("blackFitCart", []);
    if (!Array.isArray(stored)) return [];
    const grouped = new Map();
    for (const item of stored) {
      const product = catalog.find((entry) => entry.id === item?.id);
      if (!product || !product.sizes.includes(item.size) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) continue;
      const key = `${product.id}-${item.size}`;
      const quantity = Math.min(100000, item.quantity + (grouped.get(key)?.quantity || 0));
      grouped.set(key, { key, id: product.id, name: product.name, brand: product.brand, image: product.image, price: salePrice(product), size: item.size, quantity });
    }
    return [...grouped.values()];
  }
  function add(productId, size, quantity) {
    const catalog = products();
    const product = catalog.find((item) => item.id === productId);
    const items = cart(catalog);
    if (!product || !product.sizes.includes(size) || !Number.isSafeInteger(quantity) || quantity < 1) return "상품과 옵션을 다시 확인해주세요.";
    const found = items.find((item) => item.id === productId && item.size === size);
    if ((found?.quantity || 0) + quantity > product.stock[size]) return "선택한 옵션의 재고를 초과했습니다.";
    if (found) found.quantity += quantity;
    else items.push({ key: `${productId}-${size}`, id: productId, name: product.name, brand: product.brand, image: product.image, price: salePrice(product), size, quantity });
    return save("blackFitCart", items) ? "" : "장바구니를 저장하지 못했습니다.";
  }
  function orders() {
    const stored = read("blackFitOrders", []);
    const seen = new Set();
    return Array.isArray(stored) ? stored.filter((order) => order && typeof order.orderNumber === "string" && !seen.has(order.orderNumber) &&
      Array.isArray(order.items) && order.items.length && order.items.every((item) => item && typeof item.name === "string" && Number.isSafeInteger(item.id) && item.id > 0 &&
        typeof item.size === "string" && Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100000 && Number.isSafeInteger(item.price) && item.price >= 0) &&
      Number.isSafeInteger(order.total) && order.total >= 0 && seen.add(order.orderNumber)).map((order) => ({ ...order,
        status: ["결제완료", "배송준비", "배송중", "배송완료", "취소완료", "반품완료"].includes(order.status) ? order.status : typeof order.status === "string" && order.status ? order.status.slice(0, 40) : "결제완료" })) : [];
  }
  function ids(key) {
    const values = read(key, []);
    return Array.isArray(values) ? [...new Set(values.filter((id) => Number.isSafeInteger(id) && id > 0))] : [];
  }
  const salePrice = (product) => Math.round(product.price * (100 - product.discount) / 100);
  function totals(items, coupon) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon === "BLACK10" ? Math.round(subtotal * .1) : coupon === "WELCOME15" ? Math.min(Math.round(subtotal * .15), 20000) : 0;
    const shipping = subtotal && subtotal < 50000 && coupon !== "FREESHIP" ? 3000 : 0;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }
  const icons = () => window.lucide?.createIcons({ attrs: { "stroke-width": 1.7 } });
  document.addEventListener("DOMContentLoaded", icons, { once: true });
  const Shop = window.Shop = { escape, clone, read, save, transaction, notify, imageUrl, normalizeProduct, products, cart, add, orders, ids, salePrice, totals, icons, seed: [] };
  Shop.ready = fetch("catalog.json", { cache: "no-cache" }).then((response) => {
    if (!response.ok) throw new Error("catalog");
    return response.json();
  }).then((data) => {
    if (!Array.isArray(data)) throw new Error("catalog");
    Shop.seed = data.map(normalizeProduct).filter(Boolean);
  });
  Shop.ready.catch(() => notify("상품 정보를 불러오지 못했습니다. 서버 연결을 확인한 뒤 새로고침해주세요."));
})();
