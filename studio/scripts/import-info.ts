import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-11-19'}).withConfig({useCdn: false, perspective: 'raw'})

async function main() {
  const [published, draft] = await Promise.all([
    client.getDocument('infoPage'),
    client.getDocument('drafts.infoPage'),
  ])
  if (published || draft) throw new Error('Info-sivu tai sen luonnos on jo olemassa; tuonti ei korvaa sisältöä.')

  const home = await client.fetch<{photos?: {asset?: {_ref: string; _type: 'reference'}; alt?: string}[]} | null>(
    '*[_id == "homePage" && _type == "homePage"][0]{photos[]{asset, alt}}',
  )
  const cover = home?.photos?.[0]
  if (!cover?.asset?._ref || !cover.alt) throw new Error('Julkaistun etusivun ensimmäinen portfoliokuva tai sen kuvaus puuttuu.')

  const document = {
    _id: 'infoPage',
    _type: 'infoPage',
    cover: {_type: 'image', asset: cover.asset, alt: cover.alt},
    valuesTitle: 'Ydinarvot',
    values: [
      {_key: 'aitous', _type: 'object', title: 'Aitous', text: 'Kuvaan asioita sellaisina kuin ne ovat — en lavasta, en ylikaunistele. Uskon, että kauneimmissa kuvissa näkyy jotain todellista: epätäydellinen nauru, vilpitön katse, se hetki kun unohdat kameran olemassaolon kokonaan.'},
      {_key: 'lasnaolo', _type: 'object', title: 'Läsnäolo', text: 'Kun tulen kuvaukseen, olen täysin siellä. En tallenna suoritusta — olen mukana siinä hetkessä kanssasi. Minulle on tärkeää, että sinä voit olla oma itsesi, ja minä teen kaikkeni sen eteen.'},
      {_key: 'luonnollisuus', _type: 'object', title: 'Luonnollisuus', text: 'Luonto on minulle enemmän kuin tausta — se on tunnelma, valo ja hengitystila. Parhaat kuvat syntyvät usein ulkona, siellä missä ihminen tuntee olonsa vapaaksi ja omakseen.'},
    ],
    stepsTitle: 'Kuvauksen eteneminen',
    steps: [
      {_key: 'yhteys', _type: 'object', label: 'STEP 01', title: 'Ota yhteyttä', text: 'Lähetä minulle viestiä haluamastasi kuvauksesta. Sinulla ei tarvitse olla valmista suunnitelmaa.'},
      {_key: 'suunnittelu', _type: 'object', label: 'STEP 02', title: 'Suunnittelu', text: 'Suunnittelemme kuvausta viestitse, puhelimitse tai kasvokkain, riippuen kuvauksen laajuudesta. Voin ehdottaa kuvauspaikkoja ja ideoita, jos sinulla ei ole vielä ajatusta, millaisen kuvauksen haluaisit.'},
      {_key: 'kuvaus', _type: 'object', label: 'STEP 03', title: 'Kuvaus', text: 'Näemme kuvauspaikalla sovittuun aikaan ja lähdemme kuvailemaan. Pidämme rennon kuvauksen. Lopputuloksena on kauniit ja luonnolliset kuvat sinun päivästäsi.'},
      {_key: 'lahetys', _type: 'object', label: 'STEP 04', title: 'Kuvien lähetys', text: 'Lähetän sinulle valmiiksi muokatut kuvat salasanalla suojatussa nettigalleriassa 6 viikon sisällä kuvauspäivästä.'},
    ],
    contractEyebrow: 'Salla Vehkasaari Valokuvaus',
    contractTitle: 'Kuvaussopimus',
    contractSections: [
      {
        _key: 'maksu', _type: 'object', title: 'Maksu',
        text: 'Kuvaus maksetaan kahdessa osassa. Asiakkaan varatessa kuvauksen hän maksaa varausmaksun, jonka tehdessään hän hyväksyy tämän valokuvaussopimuksen. Kuvaaja lähettää loppulaskun kuvauksen jälkeen ja laskun eräpäivä on 14vrk sen saapumisesta. Yli 20km Tampereen keskustasta tapahtuviin kuvauksiin lisätään matkakulut.',
      },
      {
        _key: 'kuvat', _type: 'object', title: 'Kuvat',
        text: `Asiakas on nähnyt kuvaajan aikaisempia töitä ja on tietoinen kuvaajan kuvaustyylistä. Asiakas ymmärtää, että kuvaajan kuvaus ja editointityyli voivat muuttua ajan ja olosuhteiden myötä.

Kaikki kuvat peruskäsitellään, joka tarkoittaa valotuksen, valkotasapainon, kontrastin ja rajauksen säätämistä. Laajempi kuvien manipulointi esim asioiden poistaminen kuvasta ei kuulu palveluun. Kuvaaja päättää kuvien taiteellisen tyylin olosuhteiden ja harkintansa mukaisesti. Kuvapakettiin kuuluu mustavalkoisia ja värillisiä kuvia. kuvat toimitetaan 2-6 viikon kuluessa kuvauksesta. Kuvien toimittamisen jälkeen kuvaajalla ei ole velvollisuutta muokata kuvia lisää.`,
      },
      {
        _key: 'oikeudet', _type: 'object', title: 'Tekijänoikeudet ja kuvien säilytys',
        text: `Kaikki tekijänoikeudet säilyvät kuvaajalla ja hän saa käyttää kuvia portfoliossaan, sivustollaan, sosiaalisessa mediassa sekä muussa kuvaukseen liittyvässä markkinoinnissa ilman erillistä lupaa ellei tämän sopimuksen yhteydessä tai ennen kuvausta ole toisin sovittu. Käyttäessään kuvia kuvaaja kunnioittaa asiakasta julkaisemalla vain edustavia otoksia.

Asiakas saa maailmanlaajuisen, ei-kaupallisen lisenssin toimitettuihin kuviin. Asiakas saa julkaista kuvia, teettää paperikuvia ja muita fyysisiä tuotteita missä tahansa ei-kaupallisessa tarkoituksessa. Kaupalliseen tarkoitukseen pitää neuvotella erillinen lisenssi tämän sopimuksen ulkopuolella. Valokuvaaja ei ole vastuussa muualla teetettyjen fyysisten kuvatuotteiden sävystä tai laadusta. Jos asiakas muokkaa itse kuvia, hän on velvollinen mainitsemaan tästä julkaisun yhteydessä. Someen julkaistavat kuvat suositellaan ladattavaksi "web size" tiedostona. Asiakas voi merkitä hyvän tavan mukaisesti kuvaajan somejulkaisuihinsa.

kuvaaja on velvollinen Huolehtimaan kuvien huolellisesta varmuuskopioinnista. Valokuvaaja säilyttää kuvista varmuuskopiot 2kk kuvauspäivästä. Tämän ajan umpeuduttua kuvaaja ei ole enää velvollinen säilyttämään varmuuskopioita.`,
      },
      {
        _key: 'poikkeukset', _type: 'object', title: 'Poikkeustilanteet',
        text: `Jos kuvaajan kalusto vaurioituu tai menee rikki kesken kuvauksen kuvaaja on velvollinen toimittamaan siihen asti otetut kuvat jos mahdollista sekä sopimaan uuden kuvausajankohdan tai laskuttamaan vain jo otettujen kuvien määrään suhteutetun summan asiakkaalta.

Asiakkaalla on oikeus purkaa kuvaussopimus kirjallisesti ennen kuvausta. Kuvaajalla ei sopimuksen purun jälkeen ole mitään velvollisuuksia asiakasta kohtaan, eikä mitään jo maksettuja rahoja palauteta. Kuvaajalla on oikeus purkaa sopimus, jos asiakas hyväksyy sopimuksen purkamisen kirjallisesti TAI yksipuolisesti vain jos tulee ylitsepääsemätön este.

Ylitsepääsemätön este tarkoittaa sellaista tilannetta, jota ei voi ennakoida ja jonka takia kuvaaja ei fyysisesti pysty kuvaamaan häitä esimerkiksi vakavan loukkaantumisen/sairastumisen tai kuoleman takia. Jos kuvaaja ei pysty järjestämään toista kuvaajaa ylitsepääsemättömän esteen sattuessa, on hän velvollinen palauttamaankaikki maksetut rahat. Kuvaaja ei ole velvollinen maksamaan ylimääräistä vahingonkorvausta.

Kuvaaja sitoutuu kuvaamaan ennalta sovitun ajan. Kuvaajalla on kuitenkin oikeus keskeyttää kuvaus ennen sovitun ajan loppumista, jos joku käyttäytyy väkivaltaisesti tai uhkaavasti joko kuvaajaa tai kuvaajan kalustoa kohtaan. Myös vakavassa loukkaantumis/sairastumistapauksissa kuvaajalla on oikeus keskeyttää kuvaaminen. Tällöin kuvaaja on velvollinen toimittamaan siihen asti kuvattua sisältöä ja suhteuttamaan kuvauslaskun sisällön määrään.`,
      },
    ],
    lawText: 'Tähän sopimukseen sovelletaan Suomen lakia. Sopimuksesta aiheutuvat erimielisyydet pyritään ratkaisemaan sovittelemalla.',
    acceptanceText: 'Tätä sopimusta on tehty kaksi (2) kappaletta, yksi kullekin osapuolelle. Kuvaussopimus astuu voimaan, kun varausmaksu on maksettu eikä erillistä allekirjoitusta tarvita. Asiakas hyväksyy sopimuksen maksamalla varausmaksun.',
  }

  if (process.argv.includes('--dry-run')) {
    console.log(`Valmis tuomaan info-sivun: ${document.values.length} arvoa, ${document.steps.length} vaihetta, ${document.contractSections.length} sopimuskohtaa.`)
    return
  }
  await client.create(document)
  console.log('Info-sivu luotu julkaistuna. Olemassa olevaa sisältöä ei muutettu.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
