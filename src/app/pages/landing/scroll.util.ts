export function scrollToSection(href: string): void {
  if (!href.startsWith('#')) {
    return;
  }

  const id = href.slice(1);
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
