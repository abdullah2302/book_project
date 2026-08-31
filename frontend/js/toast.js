export function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "fa-solid fa-circle-check",
        error: "fa-solid fa-circle-xmark",
        info: "fa-solid fa-circle-info",
        warning: "fa-solid fa-triangle-exclamation"
    };

    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

   
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

  
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


export function confirmToast(message) {

    return new Promise((resolve) => {

    
        const existing = document.getElementById("confirmToastOverlay");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.id = "confirmToastOverlay";
        overlay.className = "confirm-toast-overlay";

        overlay.innerHTML = `
            <div class="confirm-toast">
                <div class="confirm-toast-icon">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <p class="confirm-toast-message">${message}</p>
                <div class="confirm-toast-actions">
                    <button type="button" class="confirm-btn-cancel">Cancel</button>
                    <button type="button" class="confirm-btn-yes">Yes, Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add("show"));

        function close(result) {
            overlay.classList.remove("show");
            setTimeout(() => overlay.remove(), 250);
            resolve(result);
        }

        overlay.querySelector(".confirm-btn-yes").addEventListener("click", () => close(true));
        overlay.querySelector(".confirm-btn-cancel").addEventListener("click", () => close(false));

   
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) close(false);
        });

        
        function handleEscape(e) {
            if (e.key === "Escape") {
                close(false);
                document.removeEventListener("keydown", handleEscape);
            }
        }
        document.addEventListener("keydown", handleEscape);
    });
}