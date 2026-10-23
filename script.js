// Marwin demo shop: products are stored as JavaScript objects in an array.
const products = [
  { id: 1, name: 'The Little Book of Wonder', category: 'books', description: 'A cosy story for curious minds.', price: 4500, icon: '📚', color: '#dce8d5', badge: 'BESTSELLER', rating: 4 },
  { id: 2, name: 'The Art of Small Things', category: 'books', description: 'A colourful book full of ideas.', price: 5200, icon: '📖', color: '#f4d9ce', badge: 'NEW', rating: 5 },
  { id: 3, name: 'Weekend Puzzle', category: 'games', description: 'A calm challenge to share.', price: 6800, icon: '🧩', color: '#e7e0f6', badge: 'POPULAR', rating: 4 },
  { id: 4, name: 'Little Game Night', category: 'games', description: 'Big laughs in a small box.', price: 7900, icon: '🎲', color: '#f7e6b9', badge: 'FAMILY PICK', rating: 5 },
  { id: 5, name: 'Creative Colour Kit', category: 'toys', description: 'Make, draw, and imagine freely.', price: 3900, icon: '🖍️', color: '#d7e9f2', badge: 'CREATIVE', rating: 4 },
  { id: 6, name: 'Tiny Garden Set', category: 'toys', description: 'A playful set for little builders.', price: 6100, icon: '🪴', color: '#dce8d5', badge: 'NEW', rating: 5 },
  { id: 7, name: 'Happy Day Gift Box', category: 'gifts', description: 'A thoughtful surprise for someone.', price: 8500, icon: '🎁', color: '#f4d9ce', badge: 'GIFT IDEA', rating: 5 },
  { id: 8, name: 'Cosy Mug & Notes', category: 'gifts', description: 'A small treat for slow mornings.', price: 4700, icon: '☕', color: '#f2dfc4', badge: 'LITTLE TREAT', rating: 4 }
];
const categoryNames = { all: 'all our little finds', books: 'books', games: 'games', toys: 'toys and play', gifts: 'gifts' };
let activeCategory = 'all';
let cartCount = 0;
let toastTimer;
const favorites = new Set();
const userRatings = {};
const productGrid = document.querySelector('#productGrid');
const searchInput = document.querySelector('#searchInput');
const resultsNote = document.querySelector('#resultsNote');
const emptyState = document.querySelector('#emptyState');
const toast = document.querySelector('#toast');

// Higher-order function: filter() receives a callback to select matching products.
function getVisibleProducts() {
  const searchText = searchInput.value.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function makeStars(product) {
  let stars = '';
  const rating = userRatings[product.id] || product.rating;
  for (let star = 1; star <= 5; star += 1) {
    stars += `<button type="button" class="${star <= rating ? 'selected' : ''}" data-rating="${star}" data-product-id="${product.id}" aria-label="Rate ${product.name} ${star} out of 5 stars">★</button>`;
  }
  return stars;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  // map() transforms product objects into HTML cards, then join() combines them.
  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card">
      <div class="product-visual visual-${product.id}">
        <span class="product-badge">${product.badge}</span>
        <button type="button" class="favorite-button ${favorites.has(product.id) ? 'favorited' : ''}" data-favorite="${product.id}" aria-label="${favorites.has(product.id) ? 'Remove from' : 'Add to'} favourites">${favorites.has(product.id) ? '♥' : '♡'}</button>
        <span class="visual-icon" aria-hidden="true">${product.icon}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${categoryNames[product.category]}</p>
        <h3>${product.name}</h3><p class="product-description">${product.description}</p>
        <div class="rating" aria-label="Product rating">${makeStars(product)}</div>
        <div class="product-bottom"><span class="price">₸${product.price.toLocaleString('en-US')}</span><button class="add-button" type="button" data-add="${product.id}">Add to bag +</button></div>
      </div>
    </article>`).join('');
  resultsNote.textContent = `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? 'find' : 'finds'} — ${categoryNames[activeCategory]}`;
  emptyState.hidden = visibleProducts.length !== 0;
  productGrid.hidden = visibleProducts.length === 0;
}

// Event delegation handles buttons added later by renderProducts().
productGrid.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  const favoriteButton = event.target.closest('[data-favorite]');
  const ratingButton = event.target.closest('[data-rating]');
  if (addButton) {
    const product = products.find((item) => item.id === Number(addButton.dataset.add));
    cartCount += 1;
    document.querySelector('#cartCount').textContent = cartCount;
    showToast(`${product.name} added to your bag.`);
    addButton.textContent = 'Added ✓';
    setTimeout(() => { if (addButton.isConnected) addButton.textContent = 'Add to bag +'; }, 900);
  }
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    renderProducts();
    showToast(favorites.has(id) ? 'Saved to your favourites.' : 'Removed from your favourites.');
  }
  if (ratingButton) {
    userRatings[Number(ratingButton.dataset.productId)] = Number(ratingButton.dataset.rating);
    renderProducts();
    showToast('Thanks for rating this find!');
  }
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    // switch statement gives each category a clear response message.
    activeCategory = button.dataset.category;
    let message;
    switch (activeCategory) {
      case 'books': message = 'A good story is waiting.'; break;
      case 'games': message = 'Let the fun begin.'; break;
      case 'toys': message = 'Time to make and play.'; break;
      case 'gifts': message = 'Find a little something for someone.'; break;
      default: message = 'Showing all our little finds.';
    }
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderProducts();
    showToast(message);
  });
});
searchInput.addEventListener('input', renderProducts);

// Keyboard navigation: left/right arrows move focus between navigation links.
const navLinks = [...document.querySelectorAll('#mainNav a')];
document.querySelector('#mainNav').addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  const currentIndex = navLinks.indexOf(document.activeElement);
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (currentIndex + direction + navLinks.length) % navLinks.length;
  navLinks[nextIndex].focus();
});

// Theme switch uses a CSS class to update the page colours.
document.querySelector('#themeButton').addEventListener('click', () => {
  const isNight = document.body.classList.toggle('night');
  document.querySelector('#themeButton').textContent = isNight ? '☀' : '☾';
  document.querySelector('#themeButton').setAttribute('aria-label', isNight ? 'Switch to day theme' : 'Switch to night theme');
  showToast(isNight ? 'Night mode is on.' : 'Day mode is on.');
});

// Surprise button updates the page and plays a short generated tone (no audio file needed).
const surpriseIdeas = [
  'Try a puzzle for a screen-free evening.',
  'Pick a book and make tonight story time.',
  'A creative kit can turn a quiet afternoon into an adventure.',
  'A small gift can make an ordinary day special.'
];
let surpriseIndex = 0;
function playTinySound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.12);
    volume.gain.setValueAtTime(0.08, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    oscillator.connect(volume); volume.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + 0.18);
    oscillator.onended = () => audio.close();
  } catch (error) { /* Sound is optional if the browser blocks audio. */ }
}
document.querySelector('#surpriseButton').addEventListener('click', () => {
  document.querySelector('#surpriseMessage').textContent = surpriseIdeas[surpriseIndex];
  surpriseIndex = (surpriseIndex + 1) % surpriseIdeas.length;
  document.querySelector('.hero-art').classList.remove('celebrate');
  void document.querySelector('.hero-art').offsetWidth;
  document.querySelector('.hero-art').classList.add('celebrate');
  playTinySound();
});

// Read More toggles extra content and updates the button attribute/text.
const readMoreButton = document.querySelector('#readMoreButton');
readMoreButton.addEventListener('click', () => {
  const extraText = document.querySelector('#aboutMore');
  const expanded = readMoreButton.getAttribute('aria-expanded') === 'true';
  extraText.hidden = expanded;
  readMoreButton.setAttribute('aria-expanded', String(!expanded));
  readMoreButton.innerHTML = expanded ? 'Read our story <span>＋</span>' : 'Show less <span>−</span>';
});

// The signup form validates data and calls a callback after successful validation.
function handleSignupSuccess(name) {
  document.querySelector('#formMessage').textContent = `Thanks, ${name}! You are on the Marwin demo list.`;
  showToast('Your demo signup looks good!');
}
document.querySelector('#signupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.querySelector('#signupName');
  const emailInput = document.querySelector('#signupEmail');
  const nameError = nameInput.parentElement.querySelector('.field-error');
  const emailError = emailInput.parentElement.querySelector('.field-error');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  nameError.textContent = nameInput.value.trim() ? '' : 'Please enter your name.';
  emailError.textContent = validEmail ? '' : 'Please enter a valid email.';
  nameInput.classList.toggle('invalid', !nameInput.value.trim());
  emailInput.classList.toggle('invalid', !validEmail);
  if (nameInput.value.trim() && validEmail) handleSignupSuccess(nameInput.value.trim());
  else document.querySelector('#formMessage').textContent = '';
});
document.querySelectorAll('#signupForm input').forEach((input) => input.addEventListener('input', () => {
  input.classList.remove('invalid');
  input.parentElement.querySelector('.field-error').textContent = '';
  document.querySelector('#formMessage').textContent = '';
}));
document.querySelector('#resetFormButton').addEventListener('click', () => {
  document.querySelector('#signupForm').reset();
  document.querySelectorAll('#signupForm .field-error').forEach((error) => error.textContent = '');
  document.querySelectorAll('#signupForm input').forEach((input) => input.classList.remove('invalid'));
  document.querySelector('#formMessage').textContent = '';
  showToast('The form has been cleared.');
});

// FAQ accordion updates both visibility and the accessible aria-expanded attribute.
document.querySelectorAll('.faq-question').forEach((button) => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  item.classList.toggle('open', !isOpen);
}));

// Subscription modal can be closed by its close buttons, backdrop, or Escape key.
const modal = document.querySelector('#subscribeModal');
const openModalButton = document.querySelector('#openModal');
let lastFocusedElement;
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}
openModalButton.addEventListener('click', () => {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.querySelector('#subscribeEmail').focus();
});
modal.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});
document.querySelector('#subscribeForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#subscribeEmail');
  document.querySelector('.modal-message').textContent = `Thanks! ${email.value} is added to this demo list.`;
  event.currentTarget.reset();
});

renderProducts();
