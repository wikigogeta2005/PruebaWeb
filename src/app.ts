interface Post {
    id?: number;
    userId: number;
    title: string;
    body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Elementos del DOM (Se inicializan al cargar el script)
let postsContainer: HTMLDivElement;
let alertBox: HTMLDivElement;
let statusBadge: HTMLSpanElement;
let searchIdInput: HTMLInputElement;
let filterUserInput: HTMLInputElement;
let createForm: HTMLFormElement;
let editModal: HTMLDivElement;
let editPostId: HTMLInputElement;
let editTitleInput: HTMLInputElement;

// --- GESTIÓN DE ESTADOS Y UI ---

function setStatus(text: string, type: 'idle' | 'loading' | 'success' | 'error') {
    if (!statusBadge) return;
    statusBadge.textContent = text;
    statusBadge.className = 'text-xs font-medium px-3 py-1.5 rounded-full ';
    
    switch (type) {
        case 'loading':
            statusBadge.className += 'bg-amber-100 text-amber-800 animate-pulse';
            break;
        case 'success':
            statusBadge.className += 'bg-emerald-100 text-emerald-800';
            break;
        case 'error':
            statusBadge.className += 'bg-rose-100 text-rose-800';
            break;
        default:
            statusBadge.className += 'bg-slate-100 text-slate-700';
    }
}

function showAlert(message: string, isError = false) {
    if (!alertBox) return;
    alertBox.className = `p-4 rounded-xl text-sm font-medium border mb-4 ${
        isError 
        ? 'bg-rose-50 border-rose-200 text-rose-800' 
        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
    }`;
    alertBox.textContent = message;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 5000);
}

// Renderizar posts dinámicamente con la animación CSS
function renderPosts(posts: Post[]) {
    if (!postsContainer) return;
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                No se encontraron publicaciones.
            </div>`;
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3 transition-all hover:shadow-md post-card-animate';
        postCard.setAttribute('data-id', String(post.id));
        
        postCard.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700">Post ID: ${post.id || 'Nuevo'}</span>
                <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">User ID: ${post.userId}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-800 leading-snug">${post.title}</h3>
            <p class="text-slate-600 text-sm leading-relaxed">${post.body}</p>
            <div class="flex gap-2 pt-2 border-t border-slate-50">
                <button onclick="openEditModal(${post.id}, '${post.title.replace(/'/g, "\\'")}')" class="text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                    Editar Título (PATCH)
                </button>
                <button onclick="deletePost(${post.id})" class="text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 transition-colors">
                    Eliminar (DELETE)
                </button>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}

// --- MÉTODOS HTTP ---

// 1. GET (Todos los posts - limitado a 10 por estética de pantalla)
async function fetchAllPosts() {
    setStatus('Cargando posts...', 'loading');
    try {
        const response = await fetch(`${BASE_URL}?_limit=10`);
        if (!response.ok) throw new Error(`Error en servidor: ${response.status}`);
        const data: Post[] = await response.json();
        renderPosts(data);
        setStatus('Posts cargados', 'success');
    } catch (error: any) {
        setStatus('Error al cargar', 'error');
        showAlert(error.message, true);
    }
}

// 2. GET (Por ID de post específico)
async function fetchPostById() {
    const id = searchIdInput.value.trim();
    if (!id) return showAlert('Por favor introduce un ID válido', true);

    setStatus(`Buscando ID ${id}...`, 'loading');
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`No se encontró el post con ID: ${id}`);
        const data: Post = await response.json();
        renderPosts([data]);
        setStatus('Búsqueda completada', 'success');
    } catch (error: any) {
        setStatus('No encontrado', 'error');
        showAlert(error.message, true);
    }
}

// 3. GET (Filtrado de posts por userId)
async function fetchPostsByUserId() {
    const userId = filterUserInput.value.trim();
    if (!userId) return showAlert('Por favor introduce un ID de usuario válido', true);

    setStatus(`Filtrando Usuario ${userId}...`, 'loading');
    try {
        const response = await fetch(`${BASE_URL}?userId=${userId}`);
        if (!response.ok) throw new Error(`Error al filtrar: ${response.status}`);
        const data: Post[] = await response.json();
        renderPosts(data);
        setStatus('Filtro aplicado', 'success');
    } catch (error: any) {
        setStatus('Error en filtro', 'error');
        showAlert(error.message, true);
    }
}

// 4. POST (Creación de nueva publicación)
async function createPost(e: Event) {
    e.preventDefault();
    const userIdVal = parseInt((document.getElementById('post-user-id') as HTMLInputElement).value);
    const titleVal = (document.getElementById('post-title') as HTMLInputElement).value;
    const bodyVal = (document.getElementById('post-body') as HTMLTextAreaElement).value;

    const newPost: Post = {
        userId: userIdVal,
        title: titleVal,
        body: bodyVal
    };

    setStatus('Guardando...', 'loading');
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        if (!response.ok) throw new Error('No se pudo simular la creación');
        const data: Post = await response.json();
        
        showAlert(`¡Creado con éxito! (Simulado en ID: ${data.id})`);
        renderPosts([data]);
        createForm.reset();
        setStatus('Post creado', 'success');
    } catch (error: any) {
        setStatus('Error al crear', 'error');
        showAlert(error.message, true);
    }
}

// 5. PATCH (Actualizar parcialmente el título)
async function updatePostTitle() {
    const id = editPostId.value;
    const newTitle = editTitleInput.value.trim();

    if (!newTitle) return showAlert('El título no puede estar vacío', true);

    setStatus('Actualizando...', 'loading');
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: newTitle }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        if (!response.ok) throw new Error('Error al actualizar el recurso');
        const data: Post = await response.json();

        // Reflejar cambio simulado dinámicamente en el DOM
        const cardInDOM = document.querySelector(`[data-id="${id}"] h3`);
        if (cardInDOM) {
            cardInDOM.textContent = data.title;
        }

        showAlert(`Título actualizado exitosamente (Simulado en ID ${id})`);
        closeModal();
        setStatus('Actualizado', 'success');
    } catch (error: any) {
        setStatus('Error al actualizar', 'error');
        showAlert(error.message, true);
    }
}

// 6. DELETE (Borrado simulado)
async function deletePost(id: number) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el post #${id}?`)) return;

    setStatus('Eliminando...', 'loading');
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al simular borrado');

        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) card.remove();

        showAlert(`Post #${id} eliminado con éxito (Simulado en el servidor)`);
        setStatus('Eliminado', 'success');
    } catch (error: any) {
        setStatus('Error al eliminar', 'error');
        showAlert(error.message, true);
    }
}

// --- CONTROL DEL MODAL DE EDICIÓN ---
function openEditModal(id: number, currentTitle: string) {
    if (!editPostId || !editTitleInput || !editModal) return;
    editPostId.value = String(id);
    editTitleInput.value = currentTitle;
    editModal.classList.remove('hidden');
}

function closeModal() {
    if (editModal) {
        editModal.classList.add('hidden');
    }
}

// 🔥 EXPOSICIÓN GLOBAL DE FUNCIONES EN WINDOW (Clave para los onclick del HTML)
(window as any).openEditModal = openEditModal;
(window as any).deletePost = deletePost;
(window as any).closeModal = closeModal;
(window as any).updatePostTitle = updatePostTitle;

// --- ASIGNACIÓN DE EVENTOS AL CARGAR EL DOM ---
window.addEventListener('DOMContentLoaded', () => {
    // Inicialización segura de elementos
    postsContainer = document.getElementById('posts-container') as HTMLDivElement;
    alertBox = document.getElementById('alert-box') as HTMLDivElement;
    statusBadge = document.getElementById('status-badge') as HTMLSpanElement;
    searchIdInput = document.getElementById('search-id-input') as HTMLInputElement;
    filterUserInput = document.getElementById('filter-user-input') as HTMLInputElement;
    createForm = document.getElementById('create-form') as HTMLFormElement;
    editModal = document.getElementById('edit-modal') as HTMLDivElement;
    editPostId = document.getElementById('edit-post-id') as HTMLInputElement;
    editTitleInput = document.getElementById('edit-title-input') as HTMLInputElement;

    // Listeners para botones y formularios
    document.getElementById('btn-get-all')?.addEventListener('click', fetchAllPosts);
    document.getElementById('btn-search-id')?.addEventListener('click', fetchPostById);
    document.getElementById('btn-filter-user')?.addEventListener('click', fetchPostsByUserId);
    createForm?.addEventListener('submit', createPost);
    document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
    document.getElementById('btn-save-patch')?.addEventListener('click', updatePostTitle);
    
    document.getElementById('btn-clear')?.addEventListener('click', () => {
        if (postsContainer) {
            postsContainer.innerHTML = `
                <div class="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                    Presiona "Cargar Todos los Posts" o realiza una consulta para empezar.
                </div>`;
        }
        setStatus('Inactivo', 'idle');
    });
});