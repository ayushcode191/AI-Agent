const chat = document.getElementById("chat");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    function appendMessage(sender, text) {
      const msg = document.createElement("div");
      msg.classList.add("message", sender === "User" ? "user" : "bot");
      msg.innerText = text;
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement("div");
      typing.classList.add("message", "bot", "typing");
      typing.innerText = "Typing...";
      typing.id = "typing-indicator";
      chat.appendChild(typing);
      chat.scrollTop = chat.scrollHeight;
    }

    function removeTyping() {
      const typing = document.getElementById("typing-indicator");
      if (typing) typing.remove();
    }

    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;

      appendMessage("User", message);
      userInput.value = "";
      showTyping();

      try {
        const res = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      removeTyping();
      await typeMessage(data.reply); // 👈 Typing effect here
      } catch (err) {
      removeTyping();
      appendMessage("Bot", "⚠️ Server error. Please try again.");
    }
  }

    async function typeMessage(text) {
      const msg = document.createElement("div");
      msg.classList.add("message", "bot");
      chat.appendChild(msg);

      for (let i = 0; i < text.length; i++) {
        msg.innerText += text[i];
        chat.scrollTop = chat.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 2)); // Adjust speed here
      }
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });