class ItemManager {
    constructor() {
        this.socket = io();
        this.itemForm = document.getElementById('itemForm');
        this.itemsList = document.getElementById('itemsList');
        this.skeletonLoader = this.createSkeletonLoader();
        this.emptyStateMessage = this.createEmptyStateMessage();

        // Modal elements
        this.modalBackdrop = document.getElementById('modalBackdrop');
        this.modalBox = document.getElementById('modalBox');
        this.modalContent = document.querySelector('.modal-content');
        this.modalTitle = document.querySelector('.modal-title');
        this.btnCancel = document.querySelector('.btn-cancel');
        this.btnAgree = document.querySelector('.btn-agree');

        this.currentItemId = null;
        this.currentAction = null;
        this.editForm = null;

        this.initialize();
    }

    // Initialize app
    initialize() {
        this.fetchItems();
        this.addFormListener();
        this.setupSocketListeners();
        // event close modal
        this.btnCancel.addEventListener('click', () => this.closeModal());

        // event click to confirm delete or edit
        this.btnAgree.addEventListener('click', () => {
            if (this.currentAction === 'delete') this.confirmDelete();
            else if (this.currentAction === 'edit') this.confirmEdit();
        });
    }

    setModal({ title, contentHTML }) {
        this.modalTitle.textContent = title;
        this.modalContent.innerHTML = contentHTML;
        this.showModal();
    }

    showModal() {
        this.modalBackdrop.classList.add("show-backdrop");
        this.modalBox.classList.add("show");
    }

    closeModal() {
        this.modalBox.classList.remove("show");
        setTimeout(() => {
            this.modalBackdrop.classList.remove("show-backdrop");
        }, 300);
        this.currentAction = null;
        this.currentItemId = null;
    }

    setLoadingButtons(itemEl, loading = true, text = '') {
        itemEl.querySelectorAll('button').forEach(btn => {
            btn.disabled = loading;
            if (text) btn.textContent = text;
        });
    }

    confirmDelete() {
        const id = this.currentItemId;
        if (!id) return;

        const itemEl = document.querySelector(`.item[data-id="${id}"]`);
        if (!itemEl) return;

        this.setLoadingButtons(itemEl, true, 'Deleting...');

        fetch(`/api/items/${id}`, { method: 'DELETE' })
            .catch(err => {
                alert('Failed to delete item.');
                this.setLoadingButtons(itemEl, false);
            });

        this.closeModal();
    }

    confirmEdit() {
        const id = this.currentItemId;
        if (!id || !this.editForm) return;

        const formData = new FormData(this.editForm);
        const title = formData.get('title').trim();
        const description = formData.get('description');

        if (!title) return alert('Title is required');

        const itemEl = document.querySelector(`.item[data-id="${id}"]`);
        if (!itemEl) return;

        this.setLoadingButtons(itemEl, true, 'Updating...');

        fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        })
            .catch(err => {
                alert('Failed to update item.');
            })
            .finally(() => {
                this.setLoadingButtons(itemEl, false);
                this.resetButtonLabels(itemEl);
            });

        this.closeModal();
    }

    resetButtonLabels(itemEl) {
        itemEl.querySelectorAll('button').forEach(btn => {
            btn.textContent = btn.classList.contains('btn-edit') ? 'Edit' : 'Delete';
        });
    }

    createSkeletonLoader() {
        const loader = document.createElement('div');
        loader.id = 'skeletonLoader';
        this.itemsList.appendChild(loader);
        return loader;
    }

    createEmptyStateMessage() {
        const message = document.createElement('div');
        message.className = 'empty-state';
        message.style.display = 'none';
        message.innerHTML = `<div class="empty-state-content"><p>No items found!</p></div>`;
        this.itemsList.appendChild(message);
        return message;
    }

    showSkeletonLoader(count = 3) {
        this.emptyStateMessage.style.display = 'none';
        this.skeletonLoader.innerHTML = '';
        this.itemsList.classList.add('loading');

        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement('div');
            skeletonItem.className = 'item skeleton-item';
            skeletonItem.innerHTML = `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 80%"></div>
                <div class="skeleton skeleton-small"></div>
                <div class="skeleton skeleton-small"></div>
                <div class="skeleton skeleton-button"></div>
                <div class="skeleton skeleton-button"></div>`;
            this.skeletonLoader.appendChild(skeletonItem);
        }
    }

    hideSkeletonLoader() {
        this.itemsList.classList.remove('loading');
        this.skeletonLoader.innerHTML = '';
    }

    showEmptyState() {
        this.emptyStateMessage.style.display = 'flex';
        this.skeletonLoader.innerHTML = '';
    }

    hideEmptyState() {
        this.emptyStateMessage.style.display = 'none';
    }

    checkEmptyState() {
        const items = document.querySelectorAll('.item:not(.skeleton-item)');
        items.length === 0 ? this.showEmptyState() : this.hideEmptyState();
    }

    fetchItems() {
        this.showSkeletonLoader();
        fetch('/api/items')
            .then(res => res.json())
            .then(data => {
                this.hideSkeletonLoader();
                document.querySelectorAll('.item:not(.skeleton-item)').forEach(el => el.remove());

                if (data.success && data.data?.length > 0) {
                    data.data.forEach(item => this.addItemToDOM(item));
                    this.hideEmptyState();
                } else {
                    this.showEmptyState();
                }
            })
            .catch(err => {
                this.hideSkeletonLoader();
                this.itemsList.innerHTML = `<div class="empty-state"><div class="empty-state-content"><p>Failed to load items. Please try again.</p></div></div>`;
            });
    }

    addFormListener() {
        this.itemForm.addEventListener('submit', e => {
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value;
            if (!title) return alert('Title is required');

            const submitBtn = this.itemForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;

            fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
                .then(res => res.json())
                .then(() => {
                    this.itemForm.reset();
                    this.hideEmptyState();
                })
                .catch(err => {
                    alert('Failed to add item.');
                })
                .finally(() => {
                    submitBtn.textContent = 'Add';
                    submitBtn.disabled = false;
                });
        });
    }

    // Socket listeners
    setupSocketListeners() {
        this.socket.on('item_created', item => {
            this.addItemToDOM(item);
            this.hideEmptyState();
        });

        this.socket.on('item_updated', item => this.updateItemInDOM(item));
        this.socket.on('item_deleted', data => {
            this.removeItemFromDOM(data.id);
            this.checkEmptyState();
        });
    }

    renderItemHTML(item) {
        return `
            <h3>${item.title}</h3>
            <p>${item.description || 'No description'}</p>
            <small>Created: ${new Date(item.created).toLocaleString()}</small>
            <small>Modified: ${new Date(item.modified).toLocaleString()}</small>
            <button class="btn-edit" onclick="itemManager.editItem('${item.id}')">Edit</button>
            <button class="btn-delete" onclick="itemManager.deleteItem('${item.id}')">Delete</button>`;
    }

    addItemToDOM(item) {
        if (document.querySelector(`.item[data-id="${item.id}"]`)) return;

        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.dataset.id = item.id;
        
        // add html content to the element
        itemEl.innerHTML = this.renderItemHTML(item);
        
        // Insert the item element into the DOM before the skeleton loader
        this.itemsList.insertBefore(itemEl, this.skeletonLoader);
    }

    updateItemInDOM(item) {
        const itemEl = document.querySelector(`.item[data-id="${item.id}"]`);
        if (itemEl) itemEl.innerHTML = this.renderItemHTML(item);
    }

    removeItemFromDOM(id) {
        const itemEl = document.querySelector(`.item[data-id="${id}"]`);
        if (itemEl) itemEl.remove();
    }

    editItem(id) {
        const itemEl = document.querySelector(`.item[data-id="${id}"]`);
        const currentTitle = itemEl.querySelector('h3').textContent;
        const currentDesc = itemEl.querySelector('p').textContent;

        const form = document.createElement('form');
        form.id = 'editForm';
        form.innerHTML = `
            <div class="form-group">
                <label for="editTitle">Title</label>
                <input type="text" id="editTitle" name="title" value="${currentTitle}" required>
            </div>
            <div class="form-group">
                <label for="editDescription">Description</label>
                <textarea id="editDescription" name="description">${currentDesc === 'No description' ? '' : currentDesc}</textarea>
            </div>
        `;
        this.editForm = form;
        this.currentItemId = id;
        this.currentAction = 'edit';

        this.setModal({ title: 'Edit Item', contentHTML: form.outerHTML });
        this.editForm = document.getElementById('editForm'); // Rebind after inserting into DOM
    }

    deleteItem(id) {
        this.currentItemId = id;
        this.currentAction = 'delete';
        this.setModal({
            title: 'Delete Item',
            contentHTML: `<p>Do you want to delete item <strong>#${id}</strong>?</p>`
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.itemManager = new ItemManager();
});
