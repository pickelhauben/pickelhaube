/**
 * Site-wide constants. Edit this file to change the name, tagline or
 * social links everywhere at once.
 */
export const site = {
  name: 'Lawrence Zhang',
  // TODO(Lawrence): provide the Chinese characters to show beside the English name (v1.1).
  nameZh: '',
  title: 'Lawrence Zhang',
  description:
    'Economics and photography student at the University of Arizona. I build institutions that help people grow.',
  // TODO(Lawrence): choose a personal email that will outlast the university address.
  email: '[[TODO: personal email]]',
  // TODO(Lawrence): add the full profile URLs, e.g. 'https://www.linkedin.com/in/your-handle'.
  // While these are empty, the links are left out and a [[TODO]] note shows on /contact.
  linkedin: '',
  github: '',
};

/** False while the email is still a `[[TODO]]` placeholder, so pages can skip the mailto link. */
export const hasEmail = !site.email.includes('[[');

/** Header navigation, in display order. */
export const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/photography', label: 'Photography' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
