const menuBtn = document.getElementById('menu-btn');
const spNav = document.getElementById('sp-nav');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    spNav.classList.toggle('active');
});
