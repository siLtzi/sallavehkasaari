"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "../lib/content";

export default function Gallery({ content }: { content: HomeContent }) {
  const { texts: t, photos } = content;
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const focusBefore = useRef<HTMLElement | null>(null);
  const photoOrder = photos.map((_, index) => index);

  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);

  function openPhoto(index: number) {
    focusBefore.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActive(index);
    dialog.current?.showModal();
  }
  function closePhoto() {
    dialog.current?.close();
    setActive(null);
    focusBefore.current?.focus();
  }
  function movePhoto(direction: number) {
    setActive(index => index === null ? photoOrder[0] : photoOrder[(photoOrder.indexOf(index) + direction + photoOrder.length) % photoOrder.length]);
  }

  function card(index: number) {
    const photo = photos[index];
    return <figure className="portfolio-card" key={photo._key}>
        <button type="button" className="portfolio-image" onClick={() => openPhoto(index)} aria-label={`${t.openPhoto}: ${photo.alt}`}>
          <img src={photo.src} alt="" loading="lazy" />
        </button>
        <figcaption>{photo.label}</figcaption>
      </figure>;
  }

  return <>
    <div className="portfolio-grid">{photos.map((photo, index) => card(index))}</div>
    <dialog className="lightbox" ref={dialog} aria-label={t.photoViewer} onCancel={event => { event.preventDefault(); closePhoto(); }} onClick={event => { if (event.target === event.currentTarget) closePhoto(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closePhoto(); } if (event.key === "ArrowRight") movePhoto(1); if (event.key === "ArrowLeft") movePhoto(-1); }}>
      <button className="lightbox-close" onClick={closePhoto}>{t.menuClose} <span aria-hidden="true">×</span></button>
      {active !== null && photos[active] && <div className="lightbox-content"><img src={photos[active].src} alt={photos[active].alt} /><div className="lightbox-controls"><button onClick={() => movePhoto(-1)} aria-label={t.previousPhoto}>←</button><span>{photos[active].label} &nbsp; / &nbsp; {photoOrder.indexOf(active) + 1} / {photos.length}</span><button onClick={() => movePhoto(1)} aria-label={t.nextPhoto}>→</button></div></div>}
    </dialog>
  </>;
}
