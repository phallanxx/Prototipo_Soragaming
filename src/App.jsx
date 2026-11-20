import { useEffect, useRef, useState } from 'react';
import siteMarkup from './siteMarkup.html?raw';
import './styles.css';

const heartIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.9c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.9Z"></path></svg>';

export default function App() {
  const siteRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => new Set());

  useEffect(() => {
    const root = siteRef.current;
    if (!root) return undefined;

    const buttons = [...root.querySelectorAll('.jersey-card')].map((card) => {
      const name = card.querySelector('h3')?.textContent.trim() || 'modelo';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'favorite-card';
      button.setAttribute('aria-label', 'Adicionar ' + name + ' aos favoritos');
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = heartIcon;
      card.querySelector('.jersey-art')?.append(button);
      return button;
    });

    return () => buttons.forEach((button) => button.remove());
  }, []);

  useEffect(() => {
    const root = siteRef.current;
    if (!root) return;

    const links = root.querySelector('.shop-nav .links');
    const menu = root.querySelector('.shop-menu');
    links?.classList.toggle('open', menuOpen);
    menu?.setAttribute('aria-expanded', String(menuOpen));
    menu?.setAttribute('aria-label', menuOpen ? 'Fechar menu' : 'Abrir menu');

    const filter = root.querySelector('.favorite-filter');
    filter?.classList.toggle('is-active', onlyFavorites);
    filter?.setAttribute('aria-pressed', String(onlyFavorites));
    filter?.setAttribute('aria-label', onlyFavorites ? 'Mostrar todos os uniformes' : 'Mostrar favoritos');

    const count = root.querySelector('.favorite-count');
    if (count) count.textContent = String(favorites.size);

    let shown = 0;
    root.querySelectorAll('.jersey-card').forEach((card) => {
      const isFavorite = favorites.has(card.id);
      card.hidden = onlyFavorites && !isFavorite;
      if (!card.hidden) shown += 1;
      const button = card.querySelector('.favorite-card');
      const name = card.querySelector('h3')?.textContent.trim() || 'modelo';
      button?.setAttribute('aria-pressed', String(isFavorite));
      button?.setAttribute('aria-label', (isFavorite ? 'Remover ' : 'Adicionar ') + name + ' aos favoritos');
    });

    const grid = root.querySelector('.jersey-grid');
    if (grid) {
      let empty = root.querySelector('.collection-empty');
      if (!empty) {
        empty = document.createElement('p');
        empty.className = 'collection-empty';
        empty.setAttribute('aria-live', 'polite');
        grid.after(empty);
      }
      empty.hidden = shown !== 0;
      empty.textContent = onlyFavorites && favorites.size === 0
        ? 'Você ainda não favoritou um modelo. Toque no coração de uma camisa para guardar aqui.'
        : 'Nenhum uniforme encontrado.';
    }
  }, [favorites, menuOpen, onlyFavorites]);

  function handleClick(event) {
    const root = siteRef.current;
    const target = event.target;
    if (!root || !(target instanceof Element)) return;

    if (target.closest('.shop-menu')) {
      setMenuOpen((open) => !open);
      return;
    }
    if (target.closest('.favorite-filter')) {
      setOnlyFavorites((active) => !active);
      return;
    }
    const favoriteButton = target.closest('.favorite-card');
    if (favoriteButton) {
      const card = favoriteButton.closest('.jersey-card');
      if (!card) return;
      setFavorites((current) => {
        const next = new Set(current);
        if (next.has(card.id)) next.delete(card.id);
        else next.add(card.id);
        return next;
      });
      return;
    }
    if (target.closest('.shop-nav .links a')) setMenuOpen(false);
  }

  function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('.subscribe')) return;
    event.preventDefault();
    window.alert('Valeu! Em breve você receberá novidades da Sora.GG.');
    form.reset();
  }

  return (
    <div
      ref={siteRef}
      className="site-shell"
      onClick={handleClick}
      onSubmit={handleSubmit}
      dangerouslySetInnerHTML={{ __html: siteMarkup }}
    />
  );
}

