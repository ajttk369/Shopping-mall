(() => {
  "use strict";
  const e = Shop.escape;
  const money = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;
  const orderSteps = ["결제완료", "배송준비", "배송중", "배송완료"];
  const returnWindow = 7 * 86400000;
  const productImages = (product) => [...new Set([product.image, product.hoverImage, ...(product.gallery || [])].filter(Boolean))];

  function productCopy(product) {
    const details = product.details;
    const description = details.description || `${product.brand}의 ${product.name}. 상품 사진과 선택 가능한 옵션을 함께 확인할 수 있습니다.`;
    const rows = [["소재", details.material], ["핏", details.fit], ["관리 방법", details.care]].filter(([, value]) => value);
    return `<div class="product-copy"><p>${e(description)}</p>${rows.length ? `<dl class="product-facts">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${e(value)}</dd></div>`).join("")}</dl>` : ""}</div>`;
  }
  function sizeGuide(product) {
    const rows = Object.entries(product.details.measurements);
    if (!rows.length) return `<p class="guide">실측 정보가 등록되지 않았습니다.</p><div class="size-table">${product.sizes.map((size) => `<span>${e(size)}</span>`).join("")}</div>`;
    const labels = [...new Set(rows.flatMap(([, row]) => Object.keys(row)))];
    return `<div class="measurement-scroll"><table class="measurement-table"><caption>상품 실측 · cm</caption><thead><tr><th scope="col">사이즈</th>${labels.map((label) => `<th scope="col">${e(label)}</th>`).join("")}</tr></thead><tbody>${rows.map(([size, row]) => `<tr><th scope="row">${e(size)}</th>${labels.map((label) => `<td>${row[label] ?? "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function amountBreakdown(order) {
    const subtotal = Number.isSafeInteger(order.subtotal) ? order.subtotal : order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Number.isSafeInteger(order.discount) ? order.discount : 0;
    const shipping = Number.isSafeInteger(order.shipping) ? order.shipping : Math.max(0, order.total - subtotal + discount);
    return `<dl class="order-amounts"><div><dt>상품 금액</dt><dd>${money(subtotal)}</dd></div><div><dt>할인${order.coupon ? ` · ${e(order.coupon)}` : ""}</dt><dd>−${money(discount)}</dd></div><div><dt>배송비</dt><dd>${money(shipping)}</dd></div><div class="amount-total"><dt>최종 금액</dt><dd>${money(order.total)}</dd></div></dl>`;
  }
  function canRequest(order) {
    const age = Date.now() - Date.parse(order.deliveredAt);
    return order.status === "배송완료" && (!order.claim || order.claim.status === "반려") && Number.isFinite(age) && age >= 0 && age <= returnWindow;
  }
  function orderTools(order) {
    const number = e(order.orderNumber);
    const claim = order.claim;
    const claimMarkup = claim ? `<div class="claim-summary"><strong>${e(claim.type)} · ${e(claim.status)}</strong><p>${e(claim.reason)}</p>${claim.resolution ? `<p>${e(claim.resolution)}</p>` : ""}</div>` : "";
    const history = Array.isArray(order.history) ? `<details class="order-history"><summary>처리 이력</summary><ul>${order.history.map((entry) => `<li>${e(entry?.status)} <time>${e(new Date(entry?.at).toLocaleString("ko-KR"))}</time></li>`).join("")}</ul></details>` : "";
    const cancel = order.status === "결제완료" ? `<button type="button" class="ghost-btn danger" data-cancel-order="${number}">주문 취소</button>` : "";
    const catalog = Shop.products();
    const exchangeRows = order.items.map((item, index) => {
      const product = catalog.find((entry) => entry.id === item.id);
      return `<label>${e(item.name)}<select name="exchange-${index}">${(product?.sizes || [item.size]).map((size) => `<option value="${e(size)}" ${size === item.size ? "selected" : ""} ${size !== item.size && product.stock[size] < item.quantity ? "disabled" : ""}>${e(size)}${size === item.size ? " · 현재 옵션" : ""}</option>`).join("")}</select></label>`;
    }).join("");
    const request = canRequest(order) ? `<details class="order-request"><summary>교환 / 반품 신청</summary><form data-order-request="${number}" class="claim-form"><label>신청 유형<select name="type"><option>반품</option><option>교환</option></select></label><div class="exchange-options" hidden>${exchangeRows}</div><label>신청 사유<textarea name="reason" maxlength="500" rows="3" required></textarea></label><button class="primary-btn" type="submit">신청 접수</button></form></details>` : "";
    const closed = order.status === "배송완료" && !canRequest(order) && !claim ? `<p class="guide">${order.deliveredAt ? "교환·반품 신청 기간이 지났습니다." : "배송 완료일 정보가 없습니다."}</p>` : "";
    return `${claimMarkup}<div class="order-actions">${cancel}</div>${request}${closed}${history}<p class="order-feedback" role="status" aria-live="polite"></p>`;
  }
  function orderDetail(order) {
    return `<div class="order-lines">${order.items.map((item) => `<div class="order-line"><img src="${e(Shop.imageUrl(item.image))}" alt="${e(item.name)}" loading="lazy"><div><strong>${e(item.name)}</strong><p>${e(item.size)} · ${item.quantity}개 · ${money(item.price)}</p></div><b>${money(item.price * item.quantity)}</b></div>`).join("")}</div>${amountBreakdown(order)}${order.customer ? `<div class="delivery-detail"><strong>배송 정보</strong><p>${e(order.customer.name)} · ${e(order.customer.phone)}</p><p>${e(order.customer.address)}</p>${order.memo ? `<p>${e(order.memo)}</p>` : ""}</div>` : ""}${orderTools(order)}`;
  }

  // Cooperating tabs share a lock; localStorage is still not a server database.
  async function withOrderLock(work) {
    try { return await (navigator.locks ? navigator.locks.request("black-fit-orders", work) : work()); }
    catch { return { error: "변경을 저장하지 못했습니다. 다시 시도해주세요." }; }
  }
  function historyEntry(order, status) {
    const entries = Array.isArray(order.history) ? order.history : [];
    order.history = [...entries.slice(-49), { status, at: new Date().toISOString() }];
  }
  function restoreStock(catalog, items, direction = 1) {
    const changes = new Map();
    for (const item of items) {
      const product = catalog.find((entry) => entry.id === item.id);
      if (!product || !product.sizes.includes(item.size)) throw new Error("stock");
      const key = `${item.id}-${item.size}`;
      const quantity = (changes.get(key)?.quantity || 0) + direction * item.quantity;
      changes.set(key, { product, size: item.size, quantity });
    }
    for (const { product, size, quantity } of changes.values()) {
      if (!Number.isSafeInteger(quantity) || product.stock[size] + quantity < 0 || product.stock[size] + quantity > 100000) throw new Error("stock");
    }
    for (const { product, size, quantity } of changes.values()) product.stock[size] += quantity;
  }
  function placeOrder(expectedCart, coupon, customer, memo, userId) {
    return withOrderLock(() => {
      const storedOrders = JSON.parse(localStorage.getItem("blackFitOrders") ?? "[]");
      const existingOrders = Shop.orders();
      if (!Array.isArray(storedOrders) || storedOrders.length !== existingOrders.length) return { error: "저장된 주문 형식을 확인해주세요. 기존 주문은 변경하지 않았습니다." };
      const catalog = Shop.products();
      const items = Shop.cart(catalog);
      if (!items.length || JSON.stringify(items) !== JSON.stringify(expectedCart) || Shop.read("blackFitCoupon", null) !== coupon) return { error: "상품·옵션·쿠폰이 변경되었습니다. 장바구니를 다시 확인해주세요." };
      try { restoreStock(catalog, items, -1); } catch { return { error: "품절 또는 재고가 부족한 옵션이 있습니다." }; }
      const orderNumber = `BF-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const now = new Date().toISOString();
      const order = { orderNumber, items, ...Shop.totals(items, coupon), coupon, customer, memo, userId, status: "결제완료", demo: true,
        createdAt: new Date().toLocaleString("ko-KR"), createdAtISO: now, history: [{ status: "결제완료", at: now }] };
      return Shop.transaction({ blackFitOrders: [order, ...existingOrders], blackFitProducts: catalog, blackFitCart: [], blackFitCoupon: null }) ? { order } : { error: "주문을 저장하지 못했습니다." };
    });
  }
  function changeOrder(number, action, payload = {}) {
    return withOrderLock(() => {
      const all = Shop.orders();
      const storedOrders = JSON.parse(localStorage.getItem("blackFitOrders") ?? "[]");
      if (!Array.isArray(storedOrders) || storedOrders.length !== all.length) return { error: "저장된 주문 형식을 확인해주세요. 기존 주문은 변경하지 않았습니다." };
      const order = all.find((entry) => entry.orderNumber === number);
      if (!order) return { error: "주문을 찾을 수 없습니다." };
      const catalog = Shop.products();
      let stockChanged = false;
      if (action === "cancel") {
        if (order.status !== "결제완료" || order.stockRestoredAt) return { error: "취소 가능한 주문이 아닙니다. 최신 상태를 확인해주세요." };
        try { restoreStock(catalog, order.items); } catch { return { error: "상품·옵션 정보가 변경되어 재고를 복구할 수 없습니다." }; }
        order.status = "취소완료";
        order.stockRestoredAt = new Date().toISOString();
        historyEntry(order, "취소완료");
        stockChanged = true;
      } else if (action === "request") {
        if (!canRequest(order) || !["반품", "교환"].includes(payload.type) || typeof payload.reason !== "string" || !payload.reason.trim() || payload.reason.trim().length > 500) return { error: "신청 가능 기간과 사유를 확인해주세요." };
        const replacements = order.items.map((item, index) => ({ ...item, size: payload.sizes?.[index] || item.size }));
        if (payload.type === "교환") {
          if (!replacements.some((item, index) => item.size !== order.items[index].size)) return { error: "교환할 사이즈를 선택해주세요." };
          try { const available = Shop.clone(catalog); restoreStock(available, order.items); restoreStock(available, replacements, -1); }
          catch { return { error: "교환 옵션의 재고가 부족하거나 상품 정보가 변경되었습니다." }; }
        }
        order.claim = { type: payload.type, reason: payload.reason.trim(), status: "접수", requestedAt: new Date().toISOString(), replacements };
        historyEntry(order, `${payload.type} 접수`);
      } else if (action === "advance") {
        const index = orderSteps.indexOf(order.status);
        if (index < 0 || index >= orderSteps.length - 1 || payload.status !== orderSteps[index + 1]) return { error: "현재 상태의 다음 단계로만 변경할 수 있습니다." };
        order.status = payload.status;
        if (order.status === "배송완료") order.deliveredAt = new Date().toISOString();
        historyEntry(order, order.status);
      } else if (action === "claim") {
        const claim = order.claim;
        if (order.status !== "배송완료" || !claim || !["접수", "승인"].includes(claim.status)) return { error: "처리 가능한 신청이 없습니다." };
        if (payload.status === "반려") {
          if (typeof payload.reason !== "string" || !payload.reason.trim() || payload.reason.length > 500) return { error: "반려 사유를 입력해주세요." };
          claim.resolution = payload.reason.trim();
        } else if (!(claim.status === "접수" && payload.status === "승인") && !(claim.status === "승인" && payload.status === "완료")) return { error: "신청 처리 순서가 올바르지 않습니다." };
        if (payload.status === "완료") {
          try {
            restoreStock(catalog, order.items);
            if (claim.type === "교환") {
              if (!Array.isArray(claim.replacements) || claim.replacements.length !== order.items.length || claim.replacements.some((item, index) => item.id !== order.items[index].id || item.quantity !== order.items[index].quantity)) throw new Error("claim");
              restoreStock(catalog, claim.replacements, -1);
            }
          } catch { return { error: "상품·옵션 재고를 확인해주세요. 신청은 완료되지 않았습니다." }; }
          stockChanged = true;
          if (claim.type === "반품") { order.status = "반품완료"; order.stockRestoredAt = new Date().toISOString(); }
          else { claim.previousItems = Shop.clone(order.items); order.items = claim.replacements.map((item) => ({ ...item, key: `${item.id}-${item.size}` })); }
        }
        claim.status = payload.status;
        claim.updatedAt = new Date().toISOString();
        historyEntry(order, `${claim.type} ${claim.status}`);
      } else if (action === "delete") {
        if (!["취소완료", "반품완료"].includes(order.status)) return { error: "진행 중인 주문은 삭제할 수 없습니다." };
        return Shop.save("blackFitOrders", all.filter((entry) => entry !== order)) ? { order } : { error: "삭제하지 못했습니다." };
      } else return { error: "지원하지 않는 작업입니다." };
      const values = { blackFitOrders: all };
      if (stockChanged) values.blackFitProducts = catalog;
      return Shop.transaction(values) ? { order } : { error: "변경을 저장하지 못했습니다." };
    });
  }
  function bindOrderTools(root, onChange) {
    const showResult = async (control, number, action, payload) => {
      const feedback = control.closest(".order-card, .order-detail-card")?.querySelector(".order-feedback");
      if (root.dataset.orderBusy) return;
      root.dataset.orderBusy = "true";
      control.disabled = true;
      try {
        const result = await changeOrder(number, action, payload);
        if (result.error) { if (feedback) feedback.textContent = result.error; else Shop.notify(result.error); }
        else await onChange(number);
      } finally { delete root.dataset.orderBusy; if (control.isConnected) control.disabled = false; }
    };
    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cancel-order]");
      if (button && confirm("주문을 취소하고 상품 재고를 복구할까요?")) showResult(button, button.dataset.cancelOrder, "cancel");
    });
    root.addEventListener("change", (event) => {
      if (event.target.name !== "type") return;
      const options = event.target.closest("[data-order-request]")?.querySelector(".exchange-options");
      if (options) options.hidden = event.target.value !== "교환";
    });
    root.addEventListener("submit", (event) => {
      const form = event.target.closest("[data-order-request]");
      if (!form) return;
      event.preventDefault();
      const data = new FormData(form);
      const sizes = [...form.querySelectorAll('[name^="exchange-"]')].map((select) => select.value);
      showResult(form.querySelector('button[type="submit"]'), form.dataset.orderRequest, "request", { type: data.get("type"), reason: data.get("reason"), sizes });
    });
  }
  Object.assign(Shop, { orderSteps, productImages, productCopy, sizeGuide, amountBreakdown, orderDetail, orderTools, placeOrder, changeOrder, bindOrderTools });
})();
