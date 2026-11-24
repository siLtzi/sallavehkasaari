export type Photo = { _key: string; src: string; alt: string; label: string };
export type Image = { src: string; alt: string };
export type Package = { _key: string; name: string; price: string; type: string; text: string; includes: string[] };
export type InstagramFeedSettings = { enabled?: boolean; accountId?: string; limit?: number };
export type InstagramPost = { id: string; imageUrl: string; permalink: string; alt: string };
export type InfoPageContent = {
  cover?: Image | null;
  valuesTitle: string; values: { _key: string; title: string; text: string }[];
  stepsTitle: string; steps: { _key: string; label: string; title: string; text: string }[];
  contractEyebrow: string; contractTitle: string;
  contractSections: { _key: string; title: string; text: string }[];
  lawText: string; acceptanceText: string;
};

export type HomeContent = {
  texts: {
    siteName: string; occupation: string; location: string; skip: string; navigationLabel: string;
    menuOpen: string; menuClose: string; portfolio: string; about: string; info: string; pricing: string; contact: string; footerContact: string;
    blog: string; blogIntro: string; blogEmpty: string; blogBack: string;
    heroTitle: string; introStatement: string; portfolioLink: string; portfolioComingSoon: string; aboutEyebrow: string; aboutTitle: string;
    aboutFirst: string; aboutSecond: string; experienceEyebrow: string; experienceTitle: string;
    experienceIntro: string; experienceDetails: string; experienceFirst: string; experienceSecond: string;
    pricingEyebrow: string; pricingIntro: string; portraitPackages: string; weddingPackages: string;
    portraitPackagesLabel: string; weddingPackagesLabel: string; packageDetails: string; packageContact: string;
    contactEyebrow: string; contactIntro: string; nameLabel: string; emailLabel: string;
    typeLabel: string; typePlaceholder: string; messageLabel: string; messagePlaceholder: string;
    formNotice: string; formSubmit: string; formSuccess: string; instagram: string; backToTop: string;
    photoViewer: string; openPhoto: string; previousPhoto: string; nextPhoto: string;
    previewLabel: string; viewLabel: string; viewHeading: string; fullPage: string; heroOnly: string;
    fontHeading: string; fontLabel: string; themeHeading: string; themeLabel: string; lightTheme: string; darkTheme: string;
    packageTypeLabel: string;
    metadataTitle: string; metadataDescription: string;
  };

  contactTypes: string[];
  logo: Image; symbol: Image; signature: Image; portrait: Image; heroDesktop: Image; heroMobile: Image;
  photos: Photo[];
  portraitPackages: Package[];
  weddingPackages: Package[];
  instagramUrl: string;
  instagramFeed?: InstagramFeedSettings | null;
};

export type BlogPostSummary = { title: string; slug: string; publishedAt: string; excerpt: string; cover?: Image };
export type BlogPost = BlogPostSummary & { body: (PortableTextBlock | { _type: "image"; _key: string; src: string; alt: string })[] };
import type { PortableTextBlock } from "@portabletext/react";

