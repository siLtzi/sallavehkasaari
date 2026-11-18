# Salla Vehkasaari — sivustoluonnos

Next.js App Router + React + TypeScript. Suunnittelusuunta: kuvavetoinen portfolio, tasapainoinen sommittelu ja kontrastinen otsikkotypografia sekä hillitty, asiakkaan brändiväreistä sovellettu värimaailma. Tekstit mukailevat alkuperäisen sivuston arkista puhetapaa.

## Käynnistys

```sh
npm install
npm run dev
```

Avaa terminaalin ilmoittama paikallinen osoite. Tuotantokoonti: `npm run build`. Tyypit: `npm run typecheck`.

## Toteutus

- `app/page.tsx`: kuvallinen aloitus, kuvaustyypeittäin ryhmitelty portfolio ja kuvakatselin, esittely, kuvausprosessi, mobiilivalikko ja yhteydenottolomake.
- `app/Pricing.tsx`: pakettivalitsin ja avattavat pakettien sisällöt.
- `app/globals.css`: responsiivinen ulkoasu, liike ja reduced-motion-tuki.
- `app/layout.tsx`: suomenkielisyys, metatiedot ja fontit. Luonnoksessa hakukoneindeksointi on estetty.
- Kuvakatselin toimii myös nuolinäppäimillä ja sulkeutuu Esc-näppäimellä. Natiivi dialog huolehtii fokuksen rajauksesta.
- Koko etusivun ylätunniste ja hero-version suuri logo käyttävät `public/SV logo.png`-kuvaa. Hero-version navigaatiossa on `public/sv.png` ja esittelyn allekirjoituksena `public/sv text.png`.
- Mobiilivalikko avautuu pehmeästi ja linkit ilmestyvät porrastetusti. Näppäimistöfokus pysyy valikossa, Esc sulkee sen ja reduced-motion-asetus poistaa animaatiot.
- Luonnoksen vertailukytkimellä voi valita koko etusivun tai koko näytön hero-aloituksen. Hero-versiossa hampurilaisvalikko avaa sivun muut osiot yksitellen; logosta pääsee takaisin aloitukseen. Valinta on vain esikatselua varten eikä tallennu.
- Luonnoksen otsikkofonttia voi vertailla Bodoni Modan, Poiret Onen ja Dorsan välillä. Fonttivalinta ei tallennu.
- Pakettityypin vaihto häivyttää vanhat paketit ennen uusia; reduced-motion näyttää sisällön ilman liikettä tai häivytystä.

## Sisältö ja jatkokehitys

Valokuvat ovat Sallan nykyisen sivuston julkisia Pixieset-kuvia, joita ladataan suoraan alkuperäisestä osoitteesta. Lähde: https://www.sallavehkasaari.fi/ . Google Fonts toimittaa Bodoni Moda-, Poiret One-, Dorsa- ja DM Sans -kirjasimet; niiden puuttuessa käytetään järjestelmäfontteja. Tuotantoon kuvat kannattaa siirtää luvallisesti omaan mediahakemistoon tai Sanityyn ja optimoida Next Imagella, fontit paikallisiksi.

Animaatiot: portfoliokuvat suurenevat hienovaraisesti osoittimella ja pakettityypin vaihto häivyttää sisällön. Reduced-motion poistaa liikkeen. Portfoliokuvat avautuvat myös näppäimistöllä.

Tekstit ovat alustavaa uudelleenkirjoitusta toimitetuista referensseistä. Paketit pohjautuvat nykyisen sivuston hinnastoon, mutta valikoima on rajattu suunnitteluluonnosta varten. Vahvista tekstit, hinnat ja lopullinen palveluvalikoima Sallan kanssa.

Lomake validoi kentät ja näyttää paikallisen demokuittauksen. Se **ei lähetä eikä tallenna** tietoja. Lähetys, tietosuojaseloste ja mahdollinen CMS liitetään myöhemmin. Ei tekaistuja asiakasarvioita.

Tässä ympäristössä npm-rekisterin verkkoyhteys oli estetty, joten esikatselua varten tarvittavat riippuvuudet kopioitiin koneella jo olleesta Next.js-asennuksesta projektin omaan node_modules-kansioon. Muut projektit eivät muutu. Verkollisessa ympäristössä aja npm install, jotta saat myös oman lukitustiedoston. Käytetty Next.js-versio vastaa paikallista asennusta; päivitä ajantasaiseen korjattuun versioon ennen julkaisua.
