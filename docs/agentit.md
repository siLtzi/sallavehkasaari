# Ohjeet jatkaville agenteille

## Projektin tila ja rakenne

- Sivusto on nykyinen Next.js App Router -sovellus repositorion juuressa. Sanity Studio on erillinen sovellus `studio/`-kansiossa, ei Next.js:n sisään upotettu.
- Sanity-projekti on Kotisivut (`tl8ba6bi`), dataset `production`. Dataset on julkisesti luettava. Kirjoittaminen ja Studioon kirjautuminen vaativat käyttäjältä oikeudet; älä pyydä tai tallenna tokeneita lähdekoodiin.
- `studio/schemaTypes/homePage.ts` määrittää jaetun sivuston sisällön (dokumentti `homePage`), ja `studio/schemaTypes/blogPost.ts` blogikirjoitukset. Studiossa sisältö on ryhmitelty suomenkielisiin osioihin; käyttöliittymän suomennos on yhteisön ylläpitämä. `lib/sanity.ts` hakee julkaistun sisällön palvelimella ja `lib/content.ts` kuvaa sen käyttötyypit.
- Studion sivukohtaiset valikkokohdat avaavat saman `homePage`-dokumentin rajatut näkymät (`studio/PageInput.tsx`); julkaisu koskee koko dokumenttia. Kun lisäät kenttiä, lisää ne myös oikeaan sivunäkymään, jotta niitä voi muokata. Jaettuja sisältöjä ei kopioida eri dokumentteihin.
- Info-sivun arvot, vaiheet, kuva ja sopimusehdot ovat erillisessä `infoPage`-dokumentissa (`studio/schemaTypes/infoPage.ts`), jolla on oma Studio-valikko ja julkaisu. Sivun otsikko ja johdantoteksti tulevat edelleen jaetusta `homePage`-dokumentista. `studio/scripts/import-info.ts` luo vain puuttuvan dokumentin eikä korvaa julkaistua dokumenttia tai luonnosta.
- Sisällön alustava tuonti on tehty käyttäjän luvalla: `studio/scripts/import-home.ts` latasi aiemmin käytetyt Pixieset-valokuvat ja paikalliset logot Sanityyn. Skripti ei korvaa olemassa olevaa etusivua; älä aja sitä uudelleen ilman tarvetta ja projektin tarkistusta. Sisältö ja hinnat ovat luonnoksia ja vaativat asiakkaan vahvistuksen.

## Sisältökäytännöt

- Sivuston tekstit, metatiedot, valokuvat, logot ja hinnastot tulee voida muokata Sanityssa. Älä lisää uusia asiakassisältöjä tai sisältökuvia kovakoodattuna komponentteihin. Käyttöliittymän tekniset rakenteet, SVG-ikonit ja esikatselun fonttien nimet ovat koodissa.
- Lisää uusille sisällöille skeemakenttä, kysely, TypeScript-tyypit ja renderöinti yhdessä. Huolehdi kuville vaihtoehtoisista teksteistä ja säilytä Sanity-taulukoiden `_key` React-avaimina.
- Frontend näyttää vain julkaistun sisällön. Haku käyttää `@sanity/client`-kirjastoa, 60 sekunnin Next.js-uudelleenvalidointia ja Sanity CDN:ää, joten julkaisu ei välttämättä näy heti. Yksinkertaiseen julkaistun sisällön hakuun ei lisätty `next-sanity`-pakettia; luonnosten esikatselua, live-päivityksiä ja webhookeja ei ole toteutettu.
- Puuttuva julkaistu `homePage` aiheuttaa virheen; älä piilota yhteys- tai sisältövirheitä kovakoodatun varasisällön taakse. Studio tarkistaa pakollisia kenttiä julkaistaessa.
- Skeemamuutosten jälkeen suorita `npx sanity schemas deploy` `studio/`-kansiossa. Muista että tämä muuttaa oikean Sanity-projektin skeemaa. Älä korvaa tai poista tuotannon sisältöä ilman erillistä tarvetta ja lupaa.
- Paikalliset CORS-osoitteet `http://localhost:3333` ja `http://localhost:3000` on sallittu. Lisää mahdollinen tuotannon Studio-osoite Sanityn asetuksiin käyttöönoton yhteydessä.

## Kehitys ja rajaukset

- Juurikansiossa `npm install`, `npm run dev`, `npm run build` ja `npm run typecheck`; Studion kansiossa erikseen `npm install`, `npm run dev` ja `npm run build`. Lukitustiedostot ovat erilliset.
- Etusivulla on vaalea asiakkaan palettiin pohjautuva ulkoasu ja Jost Light -otsikot isoilla kirjaimilla. Hero käyttää Sanityn tietokone- ja mobiilikuvaa sekä käsinkirjoitettua `signature`-kuvaa. Säilytä responsiivisuus, näppäimistökäyttö, kuvakatselin ja reduced-motion-tuki.
- Etusivun portfoliogallerian kaksi koko sivun levyistä risteävää kuvanauhaa liikkuvat vierityksen mukana vastakkaisiin suuntiin. Nauhoja täydennetään samoilla kuvilla koristeellisesti; toistot eivät ole erillisiä kohteita kuvakatselimessa tai näppäimistölle. Reduced-motion-tilassa vieritysliike on pois käytöstä, mutta kuvia voi selata sivusuunnassa. Etusivulla ei näytetä kuvaustyyppejä; erillinen portfoliosivu säilyttää tavallisen ruudukon ja kuvaustyypit. Molemmat käyttävät samoja Sanityn portfoliokuvia.
- Instagram-osion profiililinkki ja valinnaisen kuvavirran julkiset asetukset tulevat Sanitysta. `lib/instagram.ts` hakee julkaisut palvelimella Metan Unified Login -rajapinnasta; yksityinen `INSTAGRAM_ACCESS_TOKEN` kuuluu vain palvelimen ympäristömuuttujiin, ei julkiseen datasetiin, selaimeen, URL-osoitteisiin tai lokiin. Käyttöönotto ja tunnuksen ylläpito on kuvattu README:ssä. Virhetilanteessa profiililinkki säilyy ja virhe kirjataan palvelimella. Älä esitä muita kuvia Instagramin julkaisuina. Poistetun luonnoksen vertailupalkin kentät ovat yhä skeemassa vanhan sisällön yhteensopivuuden vuoksi, mutta niitä ei käytetä.
- Erilliset sivut ovat `/portfolio`, `/minusta`, `/info`, `/hinnasto` ja `/blogi`; blogikirjoitukset ovat osoitteessa `/blogi/[slug]`. Info-sivun sopimusehdot perustuvat käyttäjän vanhalta sivulta toimittamaan tekstiin ja vaativat asiakkaan sekä tarvittaessa oikeudellisen tarkistuksen ennen julkaisua. Älä muuta ehtojen sisältöä tai lupauksia ilman vahvistusta. Etusivu ja omat sivut käyttävät samoja Sanity-sisältöjä, galleriaa ja hinnastoa. Blogin päivämäärä on näkyvä sisältökenttä, ei ajastettu julkaisu. Kirjoitukset käyttävät Portable Textiä, ja vain julkaistut dokumentit näkyvät.
- Yhteydenottolomake on pelkkä demo eikä lähetä tai tallenna viestejä. Älä anna ymmärtää muuta.
- Hakukoneindeksointi on tarkoituksella estetty luonnoksessa. Ennen julkaisua tarkista tekstit, hinnat, lomake, tietosuoja, kuvaluvat, riippuvuuksien tietoturva ja tuotantoympäristön asetukset.
