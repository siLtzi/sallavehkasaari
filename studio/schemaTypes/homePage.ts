import {defineArrayMember, defineField, defineType} from 'sanity'

const text = (name: string, title: string, fieldset?: string) => defineField({name, title, type: 'string', fieldset, validation: (rule) => rule.required()})
const paragraph = (name: string, title: string, fieldset?: string) => defineField({name, title, type: 'text', rows: 3, fieldset, validation: (rule) => rule.required()})
const legacyText = (name: string, title: string) => defineField({name, title, type: 'string', hidden: true})

const image = (name: string, title: string) => defineField({
  name, title, type: 'image', validation: (rule) => rule.required(),
  fields: [text('alt', 'Vaihtoehtoinen teksti')],
})

const packageFields = [
  text('name', 'Nimi'),
  text('price', 'Hinta'),
  text('type', 'Kuvaustyyppi'),
  paragraph('text', 'Kuvaus'),
  defineField({name: 'includes', title: 'Pakettiin kuuluu', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1)}),
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Sivuston sisältö',
  type: 'document',
  preview: {select: {title: 'texts.siteName'}, prepare: () => ({title: 'Sivuston sisältö'})},
  fields: [
    defineField({
      name: 'texts', title: 'Tekstit', type: 'object', validation: (rule) => rule.required(),
      description: 'Osa teksteistä näkyy useammalla sivulla. Muutos päivittyy kaikkialle, missä tekstiä käytetään.',
      fieldsets: [
        {name: 'general', title: 'Yleiset tiedot ja navigaatio', options: {collapsible: true}},
        {name: 'about', title: 'Minusta', options: {collapsible: true}},
        {name: 'experience', title: 'Kuvaustiedot', options: {collapsible: true}},
        {name: 'pricing', title: 'Hinnaston tekstit', options: {collapsible: true}},
        {name: 'blog', title: 'Blogin tekstit', options: {collapsible: true}},
        {name: 'contact', title: 'Yhteydenottolomakkeen tekstit', options: {collapsible: true}},
        {name: 'accessibility', title: 'Muut tekstit ja saavutettavuus', options: {collapsible: true, collapsed: true}},
      ],
      fields: [
        text('siteName', 'Nimi', 'general'), text('occupation', 'Ammatti', 'general'), text('location', 'Toimialue', 'general'),
        text('portfolio', 'Portfolio', 'general'), text('about', 'Minusta', 'general'), text('info', 'Info', 'general'),
        text('pricing', 'Hinnasto', 'general'), text('contact', 'Ota yhteyttä', 'general'), text('footerContact', 'Alatunnisteen yhteyslinkki', 'general'),
        text('heroTitle', 'Etusivun otsikko', 'general'), text('introStatement', 'Etusivun aloituslause', 'general'), text('portfolioLink', 'Portfoliolinkin teksti', 'general'),
        text('instagram', 'Instagram-linkin teksti', 'general'), text('metadataTitle', 'Hakukoneotsikko', 'general'), paragraph('metadataDescription', 'Hakukonekuvaus', 'general'),
        text('aboutEyebrow', 'Esittelyn yläotsikko', 'about'), text('aboutTitle', 'Esittelyn otsikko', 'about'),
        paragraph('aboutFirst', 'Esittelyn ensimmäinen kappale', 'about'), paragraph('aboutSecond', 'Esittelyn toinen kappale', 'about'),
        text('experienceEyebrow', 'Kuvaustietojen yläotsikko', 'experience'), text('experienceTitle', 'Kuvaustietojen otsikko', 'experience'),
        paragraph('experienceIntro', 'Kuvaustietojen johdanto', 'experience'), text('experienceDetails', 'Kuvausprosessin otsikko', 'experience'),
        paragraph('experienceFirst', 'Kuvausprosessin ensimmäinen kappale', 'experience'), paragraph('experienceSecond', 'Kuvausprosessin toinen kappale', 'experience'),
        text('pricingEyebrow', 'Hinnaston yläotsikko', 'pricing'), paragraph('pricingIntro', 'Hinnaston johdanto', 'pricing'),
        text('portraitPackages', 'Henkilökuvauspakettien välilehti', 'pricing'), text('weddingPackages', 'Hääpakettien välilehti', 'pricing'),
        text('packageDetails', 'Pakettien lisätietopainike', 'pricing'), text('packageContact', 'Pakettien yhteydenottolinkki', 'pricing'),
        text('blog', 'Blogin nimi', 'blog'), paragraph('blogIntro', 'Blogin esittelyteksti', 'blog'),
        text('blogEmpty', 'Teksti, kun kirjoituksia ei ole', 'blog'), text('blogBack', 'Takaisin blogiin -linkki', 'blog'),
        text('contactEyebrow', 'Yhteysosion yläotsikko', 'contact'), paragraph('contactIntro', 'Yhteysosion johdanto', 'contact'),
        text('nameLabel', 'Lomakkeen nimikenttä', 'contact'), text('emailLabel', 'Lomakkeen sähköpostikenttä', 'contact'),
        text('typeLabel', 'Lomakkeen kuvaustyyppikenttä', 'contact'), text('typePlaceholder', 'Lomakkeen valintakehote', 'contact'),
        text('messageLabel', 'Lomakkeen viestikenttä', 'contact'), text('messagePlaceholder', 'Lomakkeen viestin ohjeteksti', 'contact'),
        text('formNotice', 'Lomakkeen huomautus', 'contact'), text('formSubmit', 'Lomakkeen lähetyspainike', 'contact'), paragraph('formSuccess', 'Lomakkeen kuittaus', 'contact'),
        text('skip', 'Ohita navigaatio', 'accessibility'), text('navigationLabel', 'Navigaation saavutettavuusteksti', 'accessibility'),
        text('menuOpen', 'Avaa valikko', 'accessibility'), text('menuClose', 'Sulje valikko', 'accessibility'),
        text('portraitPackagesLabel', 'Henkilökuvauspakettien saavutettavuusteksti', 'accessibility'), text('weddingPackagesLabel', 'Hääpakettien saavutettavuusteksti', 'accessibility'),
        text('backToTop', 'Takaisin ylös', 'accessibility'), text('photoViewer', 'Kuvakatselimen nimi', 'accessibility'),
        text('openPhoto', 'Kuvan avauspainikkeen alku', 'accessibility'), text('previousPhoto', 'Edellinen kuva', 'accessibility'), text('nextPhoto', 'Seuraava kuva', 'accessibility'),
        text('packageTypeLabel', 'Pakettivalinnan nimi', 'accessibility'),
        legacyText('portfolioComingSoon', 'Portfolio tulossa -teksti'),
        legacyText('previewLabel', 'Vertailupaneelin nimi'), legacyText('viewLabel', 'Näkymävalinnan nimi'), legacyText('viewHeading', 'Näkymävalinnan otsikko'),
        legacyText('fullPage', 'Koko etusivu'), legacyText('heroOnly', 'Vain hero'), legacyText('fontHeading', 'Fonttivalinnan otsikko'),
        legacyText('fontLabel', 'Fonttivalinnan nimi'), legacyText('themeHeading', 'Teemavalinnan otsikko'), legacyText('themeLabel', 'Teemavalinnan nimi'),
        legacyText('lightTheme', 'Vaalea teema'), legacyText('darkTheme', 'Tumma teema'),
      ],
    }),
    defineField({name: 'contactTypes', title: 'Lomakkeen kuvaustyypit', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1)}),
    image('logo', 'Logo'), image('symbol', 'Tunnus'), image('signature', 'Allekirjoitus'),
    image('portrait', 'Esittelykuva'), image('heroDesktop', 'Hero-kuva, tietokone'), image('heroMobile', 'Hero-kuva, mobiili'),
    defineField({
      name: 'photos', title: 'Portfoliokuvat', type: 'array', description: 'Lisää kuvia ja järjestä ne vetämällä. Samat kuvat näkyvät etusivulla ja portfoliossa.', validation: (rule) => rule.required().min(1),
      of: [defineArrayMember({type: 'image', fields: [text('alt', 'Vaihtoehtoinen teksti'), text('label', 'Kuvan kuvaustyyppi')]})],
    }),
    defineField({name: 'portraitPackages', title: 'Henkilö-, pari- ja perhekuvauspaketit', type: 'array', of: [defineArrayMember({type: 'object', fields: packageFields, preview: {select: {title: 'name', subtitle: 'price'}}})], validation: (rule) => rule.required().min(1)}),
    defineField({name: 'weddingPackages', title: 'Hääkuvauspaketit', type: 'array', of: [defineArrayMember({type: 'object', fields: packageFields, preview: {select: {title: 'name', subtitle: 'price'}}})], validation: (rule) => rule.required().min(1)}),
    defineField({name: 'instagramUrl', title: 'Instagram-osoite', type: 'url', validation: (rule) => rule.required()}),
    defineField({
      name: 'instagramFeed', title: 'Instagram-kuvavirta', type: 'object',
      description: 'Kuvavirta vaatii Metan ammattilaistilin ja yhteyden käyttöönoton palvelimella. Älä tallenna salasanoja tai käyttöoikeustunnuksia tänne.',
      fields: [
        defineField({name: 'enabled', title: 'Näytä Instagram-julkaisut', type: 'boolean', initialValue: false}),
        defineField({
          name: 'accountId', title: 'Instagram-tilin tunnistenumero', type: 'string',
          description: 'Metan sovelluksesta saatava julkinen tilitunniste, ei käyttäjänimi eikä käyttöoikeustunnus.',
          validation: (rule) => rule.custom((value, context) => {
            const parent = context.parent
            const enabled = typeof parent === 'object' && parent !== null && 'enabled' in parent && parent.enabled === true
            if (!value) return enabled ? 'Lisää tilin tunnistenumero ennen kuin otat kuvavirran käyttöön.' : true
            return /^\d+$/.test(value) || 'Tilitunnisteessa saa olla vain numeroita.'
          }),
        }),
        defineField({
          name: 'limit', title: 'Julkaisujen määrä', type: 'number', initialValue: 6,
          description: 'Kuinka monta uusinta julkaisua haetaan (1–12).',
          validation: (rule) => rule.integer().min(1).max(12),
        }),
      ],
    }),
  ],
})
