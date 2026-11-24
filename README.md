# Salla Vehkasaari — sivustoluonnos

Next.js App Router + React + TypeScript. Suunnittelusuunta: kuvavetoinen, ilmava portfolio, jossa luonnonläheiset kuvat ja hillitty luksustunnelma kohtaavat. Pääotsikot ovat versaalein Cormorant Garamond -kirjasimella, pienet otsikot Jostilla ja leipäteksti DM Sansilla. Värit ovat asiakkaan vaalea, lämmin paletti. Tekstit mukailevat alkuperäisen sivuston arkista puhetapaa.

## Käynnistys

```sh
npm install
npm run dev
```

Avaa terminaalin ilmoittama paikallinen osoite. Tuotantokoonti: `npm run build`. Tyypit: `npm run typecheck`. Sisältö haetaan julkisesta Sanity-datasetista; julkaistun etusivudokumentin on oltava olemassa.

Käynnistä erillinen Sanity Studio toisessa terminaalissa:

```sh
cd studio
npm install
npm run dev
```

Studio toimii normaalisti osoitteessa http://localhost:3333. Kirjaudu Sanity-projektin tunnuksilla ja valitse vasemmasta valikosta muokattava sivu. Yhteiset valikkotekstit ja sivuston tiedot ovat kohdassa **Yhteiset tiedot ja navigaatio**. Yhteydenottolomake on etusivulla, ei erillisellä sivulla.

Osa teksteistä ja kuvista näkyy useammalla sivulla: samaa sisältöä muokataan vain yhdessä paikassa. Sivujen muokkausnäkymät kuuluvat samaan dokumenttiin, joten **Julkaise** julkaisee kaikkien niiden odottavat muutokset kerralla. Julkaistut muutokset päivittyvät sivustolle välimuistin päivittyessä, yleensä noin minuutissa; Sanityn CDN voi lisätä viivettä. Luonnokset eivät näy sivustolla.

Info-sivulla on oma dokumentti: avaa Studiossa **Info-sivu** ja valitse yläreunan välilehdistä **Alku**, **Ydinarvot**, **Kuvauksen eteneminen** tai **Kuvaussopimus**. Sopimuskohdan tekstissä tyhjä rivi erottaa kappaleet. Info-sivun julkaisu ei julkaise yhteisen sivustodokumentin luonnoksia. Info-sivun otsikko ja aloitusteksti ovat yhteisiä sivuston tekstejä.

### Blogikirjoituksen julkaisu

1. Avaa Studiossa **Blogikirjoitukset** ja luo uusi kirjoitus.
2. Kirjoita otsikko ja paina osoitekentän **Luo**-painiketta. Älä muuta osoitetta julkaisun jälkeen, jos haluat vanhojen linkkien toimivan.
3. Lisää päivämäärä, lyhyt esittely ja kirjoituksen sisältö. Voit lisätä kansikuvan ja kuvia tekstin joukkoon; kuvaile kuvien sisältö kuvan kuvaus -kenttiin.
4. Tarkista tiedot ja valitse **Julkaise**. Päivämäärä näkyy kirjoituksessa, mutta ei ajasta julkaisua. Keskeneräinen kirjoitus säilyy luonnoksena.

Studion käyttöliittymässä on käytössä yhteisön suomennos; jotkin Sanityn toiminnallisuudet voivat vielä näkyä englanniksi. Blogissa näytetään vain julkaistut kirjoitukset, eikä valmiita esimerkkikirjoituksia ole lisätty.

### Instagram-kuvavirran käyttöönotto

Kuvavirta on valinnainen. Ilman käyttöönottoa osiossa näkyy Sanityssa asetettu profiililinkki. Automaattinen kuvavirta käyttää Metan virallista Instagram APIa (Unified Login):

1. Tarvitaan Instagramin ammattilaistili, Metan yrityssalkku ja Meta-sovellus. Määritä sovellukseen Unified Login ja `instagram_basic`-oikeus sekä valtuuta kyseinen tili [Metan käyttöönotto-ohjeen](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/get-started) mukaan. Metan ohjeeseen kuuluu myös HTTPS-paluusoitteen ja webhook-päätepisteen määrittely sekä valtuutuskoodin vaihto tunnukseen. Tätä kirjautumis- ja valtuutusprosessia ei ole toteutettu sivustolla, vaan se täytyy järjestää erikseen. Käyttö muille kuin sovelluksen omistamille tai hallinnoimille tileille voi vaatia Metan tarkistuksen ja lisäoikeuksia.
2. Aseta Metasta saatu Business Integration System User -käyttöoikeustunnus sivuston palvelinympäristöön nimellä `INSTAGRAM_ACCESS_TOKEN`. Paikallisesti sen voi asettaa `.env.local`-tiedostoon. Älä lisää tunnusta Sanityyn, lähdekoodiin tai viesteihin. Tuotannossa aseta se hosting-palvelun salaisiin ympäristömuuttujiin ja päivitä käyttöönotto tarvittaessa.
3. Hae valtuutetun Instagram-tilin numeerinen tunniste Metan ohjeen `me/assigned_instagram_accounts`-pyynnöllä. Avaa Studiossa **Yhteiset tiedot ja navigaatio → Instagram-kuvavirta**. Lisää tunniste, valitse julkaisujen määrä ja ota kuvavirta käyttöön. Julkaise muutokset.

Tunnuksen voimassaolo riippuu Metan sovelluksen asetuksista; seuraa ja uusi tai vaihda tunnus tarpeen mukaan. Yhteys voi lakata toimimasta myös, jos oikeudet perutaan. Palvelin hakee korkeintaan valitun määrän uusimpia julkaisuja ja tallentaa vastauksen välimuistiin enintään noin 15 minuutiksi. Julkaisut, joista ei saada kelvollista esikatselukuvaa, ohitetaan. Jos haku epäonnistuu, profiililinkki jää näkyviin ja virhe kirjataan palvelimen lokiin ilman tunnusta. Uuden tunnuksen tai asetusten käyttöönotto voi vaatia palvelun uudelleenkäynnistyksen tai uudelleenjulkaisun.

Metan APIlle ei löytynyt varmistettua erillistä hintatietoa; mahdolliset hosting- tai palvelukulut ovat erillisiä. Tarkista ehdot Metalta ennen tuotantokäyttöä.

## Toteutus

- `app/page.tsx` ja `app/Home.tsx`: Sanity-sisältöä käyttävä etusivu. Alussa on herokuva ja käsinkirjoitettu logo. Sen jälkeen tulevat aloituslause ja kolme kuvallista lukua (Portfolio, Minusta, Info), joiden kuvat ja linkit vievät alasivuille. Lisäksi etusivulla ovat Instagram, hinnasto ja yhteydenottolomake.
- Omat sivut löytyvät osoitteista `/portfolio`, `/minusta`, `/info`, `/hinnasto` ja `/blogi`. Blogikirjoitukset avautuvat osoitteesta `/blogi/[osoite]`.
- Info-sivun arvot, kuvausvaiheet, kuva ja sopimusehdot ovat omassa Sanity-dokumentissa. Sopimuksen kohdat avautuvat otsikoistaan.
- `app/SiteShell.tsx`, `app/Gallery.tsx` ja `app/About.tsx` jakavat sivupohjan ja sisältöä sivujen kesken. Blogi käyttää Sanityn Portable Text -sisältöä.
- `app/Pricing.tsx`: pakettivalitsin ja avattavat pakettien sisällöt.
- `app/globals.css`: responsiivinen ulkoasu, liike ja reduced-motion-tuki.
- `app/layout.tsx`: suomenkielisyys, Sanityn metatiedot ja fontit. Luonnoksessa hakukoneindeksointi on estetty.
- Kuvakatselin toimii myös nuolinäppäimillä ja sulkeutuu Esc-näppäimellä. Natiivi dialog huolehtii fokuksen rajauksesta.
- Etusivun aloituslausetta muokataan Studiossa kohdassa **Yhteiset tiedot ja navigaatio → Etusivun aloituslause**. Lukujen tekstit ovat samoja kuin Minusta- ja Info-sivuilla. Portfolion kuvaustyypit muodostuvat portfoliokuvien kuvaustyypeistä. Luvuissa käytetään portfoliokuvia ja esittelykuvaa.
- Logot, allekirjoitus, esittelykuva ja portfoliokuvat haetaan Sanitysta.
- Mobiilivalikko avautuu pehmeästi ja linkit ilmestyvät porrastetusti. Näppäimistöfokus pysyy valikossa, Esc sulkee sen ja reduced-motion-asetus poistaa animaatiot.
- Instagram-osio näyttää profiililinkin ja valinnaisesti Metan APIsta palvelimella haetut julkaisut.
- Pakettityypin vaihto häivyttää vanhat paketit ennen uusia; reduced-motion näyttää sisällön ilman liikettä tai häivytystä.

## Sisältö ja jatkokehitys

Käytössä olleet valokuvat ja logot on tuotu luvan perusteella Sanityyn; alkuperäiset valokuvat olivat Sallan Pixieset-sivustolta. Google Fonts toimittaa Cormorant Garamond-, Jost- ja DM Sans -kirjasimet; niiden puuttuessa käytetään järjestelmäfontteja. Kuvien optimointi ja fonttien paikallinen tarjoilu ovat jatkokehitystä.

Animaatiot: herokuva ja logo ilmestyvät rauhallisesti. Lenis pehmentää vierityksen kaikilla sivuilla. Etusivulla aloituslause paljastuu rivi kerrallaan GSAPin SplitTextillä ja ohut pystyviiva piirtyy vierityksen mukana. Lukujen kuvat avautuvat verhomaisesti, ja pienemmät kuvat liikkuvat syvyysvaikutelman luomiseksi eri tahtiin. Hiirellä kuvien päälle ilmestyy pyöreä nuoli. Pakettityypin vaihto häivyttää sisällön. Reduced-motion poistaa liikkeen ja pehmeän vierityksen. Portfoliokuvat avautuvat myös näppäimistöllä. Ikonit tulevat Lucidesta. Motion on asennettu jatkokehitystä varten.

Tekstit ovat alustavaa uudelleenkirjoitusta toimitetuista referensseistä. Paketit pohjautuvat nykyisen sivuston hinnastoon, mutta valikoima on rajattu suunnitteluluonnosta varten. Vahvista tekstit, hinnat ja lopullinen palveluvalikoima Sallan kanssa.

Info-sivun kuvaussopimus on tuotu vanhalta sivulta toimitettuna tekstinä. Varmista Sallan kanssa, että ehdot ja käytännöt ovat ajan tasalla, ja tarkistuta sopimusehtojen soveltuvuus ennen julkaisua.

Lomake validoi kentät ja näyttää paikallisen demokuittauksen. Se **ei lähetä eikä tallenna** tietoja. Lähetys ja tietosuojaseloste liitetään myöhemmin. Ei tekaistuja asiakasarvioita.

Agenttien jatkokehitysohjeet: [docs/agentit.md](docs/agentit.md). Käytetty Next.js-versio on vanha; päivitä ajantasaiseen korjattuun versioon ennen julkaisua.
