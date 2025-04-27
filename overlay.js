// overlay.js

// Tạo HTML cho overlay
const overlayId = 'merlin-ext-overlay-root';

function createOverlay() {
    if (document.getElementById(overlayId)) return;
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.width = '33vw';
    overlay.style.height = '98vh';
    overlay.style.maxWidth = '69vw';
    overlay.style.minWidth = '520px';
    overlay.style.minHeight = '98vh';
    overlay.style.maxHeight = '98vh';
    overlay.style.background = '#fafafa';
    overlay.style.boxShadow = '0 2px 24px rgba(0,0,0,0.18)';
    overlay.style.zIndex = '999999';
    overlay.style.borderRadius = '12px 0 0 12px';
    overlay.style.border = '1px solid #e4e4e7';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.transition = 'transform 0.3s cubic-bezier(.4,0,.2,1)';
    overlay.style.transform = 'translateX(0)';

    // Nút thu gọn
    const collapseBtn = document.createElement('button');
    collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6l-6 6"></path></svg>';
    collapseBtn.style.position = 'absolute';
    collapseBtn.style.left = '-32px';
    collapseBtn.style.top = '24px';
    collapseBtn.style.width = '32px';
    collapseBtn.style.height = '32px';
    collapseBtn.style.background = '#fafafa';
    collapseBtn.style.border = '1px solid #e4e4e7';
    collapseBtn.style.borderRadius = '16px';
    collapseBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    collapseBtn.style.cursor = 'pointer';
    collapseBtn.title = 'Thu gọn';
    collapseBtn.onclick = () => {
        if (overlay.style.transform === 'translateX(0px)') {
            overlay.style.transform = 'translateX(100%)';
            collapseBtn.title = 'Mở rộng';
        } else {
            overlay.style.transform = 'translateX(0px)';
            collapseBtn.title = 'Thu gọn';
        }
    };
    overlay.appendChild(collapseBtn);

    // Nội dung mẫu (bạn có thể thay bằng UI thật)
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.overflow = 'auto';
    content.style.padding = '32px';
    content.innerHTML = `<h2 style="margin-bottom:16px;">Merlin Overlay</h2><p>Bạn có thể thay thế nội dung này bằng UI thật.</p>`;
    overlay.appendChild(content);

    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.remove();
}

function toggleOverlay() {
    if (document.getElementById(overlayId)) {
        removeOverlay();
    } else {
        createOverlay();
    }
}

// Lắng nghe message từ background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.toggleOverlay) {
        toggleOverlay();
    }
}); 