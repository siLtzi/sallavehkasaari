import {getCliClient} from 'sanity/cli'
import {readFile} from 'node:fs/promises'
import {resolve} from 'node:path'

const client = getCliClient({apiVersion: '2026-11-19'})
const base = 'https://images-pw.pixieset.com/site/NQ7zQx/'

async function upload(source: string, alt: string) {
  let bytes: Buffer
  if (source.startsWith('https://')) {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`Kuvan lataus epäonnistui: ${source} (${response.status})`)
    bytes = Buffer.from(await response.arrayBuffer())
  } else {
    bytes = await readFile(resolve(process.cwd(), '..', 'public', source))
  }
  const asset = await client.assets.upload('image', bytes, {filename: source.split('/').pop()})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt}
}

async function main() {
  if (await client.getDocument('homePage') || await client.getDocument('drafts.homePage')) {
    throw new Error('Etusivu on jo olemassa; tuonti ei korvaa olemassa olevaa sisältöä.')
  }

  const [logo, symbol, signature, portrait, heroDesktop, heroMobile, ...photos] = await Promise.all([
    upload('SV logo.png', 'Salla Vehkasaari'),
    upload('sv.png', 'Salla Vehkasaari'),
    upload('sv text.png', 'Salla Vehkasaari'),
    upload(base + 'lD8E0G/luontominabest-b2ab39ef-1500.jpg', 'Salla kukkaniityllä'),
    upload(base + 'PY98Z3/DSC04521-bafe8cf9-1500.jpg', 'Pariskunta istuu kallioisessa maisemassa'),
    upload(base + 'KvYRJx/DSC04519-9680c586-1500.jpg', 'Pariskunta istuu kallioisessa maisemassa'),
    upload(base + 'm38XJo/DSC02433-75e6bfee-1500.jpg', 'Hääpari käsi kädessä'),
    upload(base + '9k40A5/DSC00474-2c415b5c-1500.jpg', 'Parikuva Sallan portfoliosta'),
    upload(base + 'Paeywn/11-0854efcd-1500.jpg', 'Ylioppilas metsässä'),
    upload(base + 'Myw0Gj/DSC07359-eb679f32-1500.jpg', 'Perhe yhdessä ulkona'),
  ])
  const texts = {
    siteName: 'Salla Vehkasaari', occupation: 'VALOKUVAAJA', location: 'Tampere',
    skip: 'Siirry sisältöön', navigationLabel: 'Päänavigaatio', menuOpen: 'Valikko', menuClose: 'Sulje',
    portfolio: 'Portfolio', about: 'Minusta', info: 'Info', pricing: 'Hinnasto', contact: 'Ota yhteyttä', footerContact: 'Yhteys',
    blog: 'Blogi', blogIntro: 'Kirjoituksia kuvauksista ja niiden taustoista.', blogEmpty: 'Blogissa ei ole vielä julkaisuja.', blogBack: 'Takaisin blogiin',
    heroTitle: 'Valokuvaaja Salla Vehkasaari', introStatement: 'Valokuvausta sulle, joka haluat olla oma itsesi.', portfolioLink: 'Katso portfolio', portfolioComingSoon: 'Portfolio-sivu tulossa',
    aboutEyebrow: 'KAMERAN TAKANA', aboutTitle: 'Hei, oon Salla.',
    aboutFirst: 'Oon Tampereen seudulla toimiva valokuvaaja. Rakastan luonnon rauhaa, aitoja kohtaamisia ja kuvia, joissa ihmisen ei tarvi olla mitään muuta kuin oma itsensä.',
    aboutSecond: 'Haluan luoda kuvaustilanteen, jossa on helppo hengittää ja olla läsnä. Autan sua rentoutumaan kameran edessä, jotta voit keskittyä hetkeen.',
    experienceEyebrow: 'TIETOA KUVAUKSESTA', experienceTitle: 'Kuvaukseen tuleminen',
    experienceIntro: 'Jos sua vähän jännittää, se ei haittaa. Sun ei tarvitse osata olla kuvattavana — mä autan.',
    experienceDetails: 'Näin kuvaus etenee',
    experienceFirst: 'Suunnitellaan kuvausta viestitse, puhelimitse tai kasvokkain. Voin ehdottaa kuvauspaikkoja ja ideoita, jos sulla ei ole vielä ajatusta. Kuvaustilanteessa ohjaan sua tarvittaessa ja pidetään kuvaus rentona.',
    experienceSecond: 'Lähetän valmiiksi muokatut kuvat salasanalla suojatussa nettigalleriassa 2–6 viikon päästä kuvauspäivästä.',
    pricingEyebrow: 'KUVAUSPAKETIT', pricingIntro: 'Jos et oo varma mikä sopii sulle parhaiten, laita mulle viestiä, niin mietitään yhdessä.',
    portraitPackages: 'Henkilöt, parit & perheet', weddingPackages: 'Häät',
    portraitPackagesLabel: 'Henkilö-, pari- ja perhekuvauspaketit', weddingPackagesLabel: 'Hääkuvauspaketit',
    packageDetails: 'Mitä pakettiin kuuluu?', packageContact: 'Kysy kuvauksesta',
    contactEyebrow: 'SALLA VEHKASAARI VALOKUVAUS', contactIntro: 'Haluaisitko mut kuvaamaan? Kerro vähän itsestäsi ja siitä, millaista kuvausta mietit.',
    nameLabel: 'Nimi', emailLabel: 'Sähköposti', typeLabel: 'Millaista kuvausta mietit?', typePlaceholder: 'Valitse kuvaus',
    messageLabel: 'Viesti', messagePlaceholder: 'Kuvauksen ajankohta, paikka, toiveet…', formNotice: 'Luonnos — viestiä ei lähetetä.',
    formSubmit: 'Kokeile lomaketta', formSuccess: 'Lomake toimii. Viestiä ei lähetetty, sillä tämä on sivuston luonnos.',
    instagram: 'Instagram', backToTop: 'Takaisin ylös', photoViewer: 'Valokuvan katselu',
    openPhoto: 'Avaa kuva', previousPhoto: 'Edellinen kuva', nextPhoto: 'Seuraava kuva',
    previewLabel: 'Luonnoksen vertailu', viewHeading: 'NÄKYMÄ', viewLabel: 'Valitse etusivun näkymä',
    fullPage: 'Koko etusivu', heroOnly: 'Vain hero', fontHeading: 'OTSIKOT', fontLabel: 'Valitse otsikkofontti',
    themeHeading: 'TEEMA', themeLabel: 'Valitse teema', lightTheme: 'Vaalea', darkTheme: 'Tumma',
    packageTypeLabel: 'Kuvauspaketin tyyppi',
    metadataTitle: 'Salla Vehkasaari | Valokuvaaja',
    metadataDescription: 'Luonnollista henkilö-, pari-, perhe- ja hääkuvausta. Salla Vehkasaari, Tampere.',
  }
  const portraitPackages = [
    {name: 'Hile', price: '100 €', type: 'Minikuvaus', text: 'Hile on sulle, joka haluaa nopeat ja hyvät kuvat itsestäsi juuri tähän hetkeen. Näppärä ja juuri sopiva paketti valmistuvalle tai profiilikuvan päivitykseen.', includes: ['Suunnittelu viestitse', 'Noin 20 min kuvausaika', '6 valmista kuvaa', 'Varausmaksu 25 €']},
    {name: 'Kajo', price: '200 €', type: 'Henkilöt, parit ja perheet', text: 'Kajo sopii sulle, joka haluaa laajemmat kuvat itsestään, rakkaansa kanssa tai perheen kans rennot kuvat. Oli sitten odottava äiti, perheellinen tai parisuhteessa, tää on hyvä peruspaketti sulle.', includes: ['Suunnittelu viestitse', 'Kiireetön kuvausaika', 'Väh. 15 valmista kuvaa', 'Varausmaksu 50 €']},
    {name: 'Usva', price: '300 €', type: 'Parit, perheet ja juhlat', text: 'Usva on mun laajempi paketti pareille ja perheille. Tää paketti on dokumentaarisempi ja yksityiskohtaisempi kuvaus – täydellinen perheille, juhliin ja kihlaukseen. Tallentan teidän välisen yhteyden ja kaikki kauniit yksityiskohdat.', includes: ['Suunnittelu viestitse', 'Kiireetön kuvausaika', 'Koko galleria', 'Varausmaksu 70 €']},
  ]
  const weddingPackages = [
    {name: 'Valo', price: '500 €', type: 'Hääpotretit', text: 'Valo sopii teille, jotka haluatte ikuistaa päivästänne vain hääpotretit. Teidän välinen yhteys – rauhassa ja luonnollisesti.', includes: ['Suunnittelupalaveri 2 kk–2 vk ennen', '1–1,5 h kuvaus', 'Väh. 60 valmista kuvaa', 'Varausmaksu 100 €']},
    {name: 'Aava', price: '700 €', type: 'Hääpotretit ja vihkiminen', text: 'Aava sopii teille, jotka haluatte ikuistaa hääpäivän tärkeimmät hetket ilman koko päivän kuvausta. Päivään mahtuu hääpotretit, vihkiminen ja kaikki se mitä syntyy niiden ympärille – läheiset ja teidän välinen rakkaus.', includes: ['Suunnittelupalaveri 2 kk–2 vk ennen', 'Hääpotretit, vihkiminen ja ryhmäkuvat', 'Sneak peek 48 h sisällä', 'Väh. 200 valmista kuvaa', 'Varausmaksu 200 €']},
    {name: 'Lumo', price: '1 400 €', type: 'Dokumentaarinen hääkuvaus', text: 'Lumo on täysi hääpäivä – alusta loppuun. Kahdeksaan tuntiin mahtuu kaikki: valmistautuminen, vihkiminen, potretit, juhla, tunteet, nauru ja ne hetket joita kukaan ei osannut odottaa.', includes: ['Suunnittelupalaveri 2 kk–2 vk ennen', '8 h kuvaus', 'Sneak peek 48 h sisällä', 'Väh. 350 valmista kuvaa', 'Lisätunti 100 €/h', 'Varausmaksu 300 €']},
  ]
  await client.createIfNotExists({
    _id: 'homePage', _type: 'homePage', texts: {_type: 'object', ...texts}, logo, symbol, signature, portrait, heroDesktop, heroMobile,
    photos: photos.map((photo, i) => ({...photo, _key: `photo${i + 1}`, label: ['Hääkuvaus', 'Parikuvaus', 'Potrettikuvaus', 'Perhekuvaus'][i]})),
    portraitPackages: portraitPackages.map((pack, i) => ({...pack, _type: 'object', _key: `portrait${i + 1}`})),
    weddingPackages: weddingPackages.map((pack, i) => ({...pack, _type: 'object', _key: `wedding${i + 1}`})),
    contactTypes: ['Henkilökuvaus', 'Parikuvaus', 'Perhekuvaus', 'Hääkuvaus', 'Jotain muuta'],
    instagramUrl: 'https://www.instagram.com/sallavehkasaari/',
  })
  console.log('Etusivu ja kuvat tuotu Sanityyn.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
