// highlight current nav link
(function(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  // simple email obfuscation (avoids putting raw email in HTML)
  const el = document.querySelector("[data-email]");
  if (el){
    const user = el.getAttribute("data-user");
    const domain = el.getAttribute("data-domain");
    const addr = `${user}@${domain}`;
    el.textContent = addr;
    el.href = `mailto:${addr}`;
  }
})();
