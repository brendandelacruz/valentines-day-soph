(() => {
  const heartsHost = document.querySelector(".hearts");

  const stageAsk = document.getElementById("stageAsk");
  const stageYay = document.getElementById("stageYay");

  const questionText = document.getElementById("questionText");
  const hintText = document.getElementById("hintText");
  const errorText = document.getElementById("errorText");

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  const restartBtn = document.getElementById("restartBtn");
  const yayRestart = document.getElementById("yayRestart");

  // Your exact "No" stages:
  const noStages = [
    "Are you sure?",
    "Are you sure you're sure?",
    "babe pleaseeeee are you sure?",
    "cmon babe you know you wanna say yes",
    "you better say yes",
    "JUST SAY YES BABE WHY ARE YOU HESITATING",
    "Last chance babe"
  ];

  const finalError =
    "sorry but you have to say yes or else I'll just die";

  let noIndex = 0; // how many times she clicked "No"
  let isYay = false;

  // Yes growth behavior:
  // Keep it accessible: we scale Yes gradually but keep layout stable.
  const yesScaleBase = 1;
  const yesScaleStep = 0.07;
  const yesScaleMax = yesScaleBase + yesScaleStep * (noStages.length + 1);

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function setYesScale(nClicks){
    const scale = clamp(yesScaleBase + yesScaleStep * nClicks, yesScaleBase, yesScaleMax);
    yesBtn.style.transform = `scale(${scale})`;
  }

  function clearError(){
    errorText.hidden = true;
    errorText.textContent = "";
  }

  function showError(msg){
    errorText.textContent = msg;
    errorText.hidden = false;
  }

  function setHintVisible(visible){
    hintText.hidden = !visible;
  }

  function setAskView(){
    isYay = false;
    stageYay.hidden = true;
    stageAsk.hidden = false;

    questionText.textContent = "Be my Valentine? 💘";
    noBtn.textContent = "No 😭";
    yesBtn.textContent = "Yes 💞";

    noIndex = 0;
    setYesScale(0);
    clearError();
    setHintVisible(false);

    // Put focus on the question region so screen readers announce changes nicely
    questionText.focus?.();
  }

  function setYayView(){
    isYay = true;
    stageAsk.hidden = true;
    stageYay.hidden = false;
    clearError();
    setHintVisible(false);

    // Move focus to the celebration title for accessibility
    const yayTitle = stageYay.querySelector(".yayTitle");
    if (yayTitle) {
      yayTitle.setAttribute("tabindex", "-1");
      yayTitle.focus();
    }
  }

  function handleNo(){
    if (isYay) return;

    clearError();

    // After last stage, any further "No" clicks trigger the error
    if (noIndex >= noStages.length) {
      showError(finalError);
      setHintVisible(true);
      return;
    }

    // Advance to the next stage
    const nextText = noStages[noIndex];
    noBtn.textContent = nextText;

    // Increase Yes button size each time No is clicked
    setYesScale(noIndex + 1);

    setHintVisible(false);

    noIndex += 1;
  }

  function handleYes(){
    setYayView();
  }

  // Generate floating hearts (decorative only)
  const hearts = ["💗","💖","💜","❤️","💘","💞"];
  function spawnHeart(){
    if (!heartsHost) return;
    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const left = Math.random() * 100;
    const size = 16 + Math.random() * 18;
    const duration = 6 + Math.random() * 6;

    el.style.left = `${left}vw`;
    el.style.bottom = `-10vh`;
    el.style.fontSize = `${size}px`;
    el.style.animationDuration = `${duration}s`;

    heartsHost.appendChild(el);
    window.setTimeout(() => el.remove(), duration * 1000);
  }

  // Wire events
  noBtn.addEventListener("click", handleNo);
  yesBtn.addEventListener("click", handleYes);

  restartBtn.addEventListener("click", setAskView);
  yayRestart.addEventListener("click", setAskView);

  // Accessibility: allow Enter/Space naturally via buttons, no extra code needed.

  // Start
  setAskView();

  // Heart loop
  spawnHeart();
  window.setInterval(spawnHeart, 450);
})();
